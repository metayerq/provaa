
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AutomatedEmailRequest {
  to: string;
  subject: string;
  content: string;
  templateId: string;
  context?: {
    userId?: string;
    eventId?: string;
    bookingId?: string;
    hostId?: string;
  };
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { to, subject, content, templateId, context }: AutomatedEmailRequest = await req.json();

    console.log('📧 Sending automated email:', { to, subject, templateId });

    // Convert content to HTML if it's not already
    const htmlContent = content.includes('<html>') ? content : `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; }
            .header { background: #f8f9fa; padding: 20px; text-align: center; border-bottom: 1px solid #ddd; }
            .content { padding: 20px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            h1, h2, h3 { color: #333; }
            .button { display: inline-block; padding: 12px 24px; background: #059669; color: white; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Provaa</h1>
            </div>
            <div class="content">
              ${content.replace(/\n/g, '<br>')}
            </div>
            <div class="footer">
              <p>This email was sent by Provaa - Your Culinary Experience Platform</p>
              <p>If you have any questions, please contact us at support@provaa.co</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email using verified provaa.co domain
    const { error: emailError } = await resend.emails.send({
      from: 'Provaa <notifications@provaa.co>',
      to: [to],
      subject: subject,
      html: htmlContent,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      
      let errorMessage = emailError.message || 'Unknown email error';
      if (errorMessage.includes('domain is not verified')) {
        errorMessage = 'Domain verification issue. Please verify the provaa.co domain in your Resend dashboard.';
      } else if (errorMessage.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait before sending more emails.';
      }
      
      throw new Error(errorMessage);
    }

    // Log email send to database for tracking
    try {
      await supabase
        .from('email_logs')
        .insert({
          template_id: templateId,
          recipient_email: to,
          subject: subject,
          status: 'sent',
          user_id: context?.userId,
          event_id: context?.eventId,
          booking_id: context?.bookingId,
          host_id: context?.hostId,
          sent_at: new Date().toISOString()
        });
    } catch (logError) {
      console.warn('Failed to log email send:', logError);
      // Don't fail the email send if logging fails
    }

    console.log('✅ Automated email sent successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('❌ Error sending automated email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);
