
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { PasswordResetEmail } from "./_templates/password-reset.tsx";
import { EmailConfirmationEmail } from "./_templates/email-confirmation.tsx";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const hookSecret = Deno.env.get("SUPABASE_AUTH_WEBHOOK_SECRET") || "your-webhook-secret";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    
    console.log('🔍 Received auth webhook:', payload);

    // Verify webhook signature
    const wh = new Webhook(hookSecret);
    let webhookData;
    
    try {
      webhookData = wh.verify(payload, headers);
    } catch (error) {
      console.error('❌ Webhook verification failed:', error);
      return new Response("Webhook verification failed", { 
        status: 401,
        headers: corsHeaders 
      });
    }

    const {
      user,
      email_data: { 
        token, 
        token_hash, 
        redirect_to, 
        email_action_type,
        site_url 
      },
    } = webhookData as {
      user: { email: string };
      email_data: {
        token: string;
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
        site_url: string;
      };
    };

    console.log('📧 Processing auth email:', { email_action_type, email: user.email });

    let emailHtml: string;
    let subject: string;

    // Determine email template based on action type
    switch (email_action_type) {
      case 'recovery':
        subject = 'Reset your Provaa password';
        emailHtml = await renderAsync(
          React.createElement(PasswordResetEmail, {
            email: user.email,
            token_hash,
            redirect_to: redirect_to || `${site_url}/`,
            site_url: site_url || window.location.origin,
          })
        );
        break;

      case 'signup':
      case 'email_change':
        subject = email_action_type === 'signup' ? 'Confirm your Provaa account' : 'Confirm your email change';
        emailHtml = await renderAsync(
          React.createElement(EmailConfirmationEmail, {
            email: user.email,
            token_hash,
            redirect_to: redirect_to || `${site_url}/`,
            site_url: site_url || window.location.origin,
          })
        );
        break;

      default:
        console.error('❌ Unknown email action type:', email_action_type);
        return new Response(`Unknown email action type: ${email_action_type}`, { 
          status: 400,
          headers: corsHeaders 
        });
    }

    // Send email using Resend with Provaa branding
    const { error: emailError } = await resend.emails.send({
      from: 'Provaa <notifications@provaa.co>',
      to: [user.email],
      subject: subject,
      html: emailHtml,
    });

    if (emailError) {
      console.error('❌ Resend error:', emailError);
      
      let errorMessage = emailError.message || 'Unknown email error';
      if (errorMessage.includes('domain is not verified')) {
        errorMessage = 'Domain verification issue. Please verify the provaa.co domain in your Resend dashboard.';
      } else if (errorMessage.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait before sending more emails.';
      }
      
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log('✅ Auth email sent successfully:', { type: email_action_type, to: user.email });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error('❌ Error in send-auth-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
