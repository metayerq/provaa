
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  templateId: string;
  testEmail: string;
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

    const { templateId, testEmail }: TestEmailRequest = await req.json();

    console.log('Sending test email for template:', templateId, 'to:', testEmail);

    // Get template details
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      throw new Error('Template not found');
    }

    // Replace template variables with sample data
    const replaceVariables = (text: string) => {
      return text
        .replace(/\{\{user_name\}\}/g, 'John Doe')
        .replace(/\{\{event_title\}\}/g, 'Wine Tasting Evening - TEST')
        .replace(/\{\{event_date\}\}/g, 'Saturday, May 27, 2025')
        .replace(/\{\{event_time\}\}/g, '7:00 PM')
        .replace(/\{\{event_location\}\}/g, '123 Wine Street, Lisboa')
        .replace(/\{\{booking_ref\}\}/g, 'BK-TEST123')
        .replace(/\{\{host_name\}\}/g, 'Maria Silva')
        .replace(/\{\{total_amount\}\}/g, '€45.00');
    };

    const emailSubject = replaceVariables(template.subject);
    const emailContent = replaceVariables(template.content);

    // Create HTML email with proper styling
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailSubject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; }
            .header { background: #f8f9fa; padding: 20px; text-align: center; border-bottom: 1px solid #ddd; }
            .content { padding: 20px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            h1, h2, h3 { color: #333; }
            .test-banner { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 10px; margin-bottom: 20px; border-radius: 4px; text-align: center; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Provaa</h1>
            </div>
            <div class="content">
              <div class="test-banner">
                🧪 TEST EMAIL - Template: ${template.name}
              </div>
              ${emailContent}
            </div>
            <div class="footer">
              <p>This is a test email sent from the Provaa admin panel.</p>
              <p>Template ID: ${templateId} | Type: ${template.type} | Status: ${template.status}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email using verified provaa.co domain
    const { error: emailError } = await resend.emails.send({
      from: 'Provaa Test <test@provaa.co>',
      to: [testEmail],
      subject: `[TEST] ${emailSubject}`,
      html: emailHtml,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      
      // Provide helpful error messages
      let errorMessage = emailError.message || 'Unknown email error';
      if (errorMessage.includes('domain is not verified')) {
        errorMessage = 'Domain verification issue. Please verify the provaa.co domain in your Resend dashboard.';
      } else if (errorMessage.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait before sending more test emails.';
      }
      
      throw new Error(errorMessage);
    }

    console.log('Test email sent successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test email sent successfully',
        template: template.name,
        recipient: testEmail
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error sending test email:', error);
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
