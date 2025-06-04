
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    console.log('Starting event reminder email job...');

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateString = tomorrow.toISOString().split('T')[0];

    console.log('Looking for events on:', tomorrowDateString);

    // Get all confirmed bookings for events happening tomorrow
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        events!inner (
          title,
          date,
          time,
          location,
          host_id,
          meeting_point_details
        )
      `)
      .eq('status', 'confirmed')
      .eq('events.date', tomorrowDateString);

    if (bookingsError) {
      throw new Error(`Failed to fetch bookings: ${bookingsError.message}`);
    }

    console.log(`Found ${bookings?.length || 0} bookings for tomorrow`);

    if (!bookings || bookings.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No reminders to send', count: 0 }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    let emailsSent = 0;
    let emailsFailed = 0;

    // Send reminder email for each booking
    for (const booking of bookings) {
      try {
        // Check if user wants reminder emails
        let sendReminder = true;
        
        if (booking.user_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email_notifications')
            .eq('id', booking.user_id)
            .single();

          if (profile?.email_notifications && 
              typeof profile.email_notifications === 'object' && 
              'reminders' in profile.email_notifications) {
            sendReminder = profile.email_notifications.reminders === true;
          }
        }

        if (!sendReminder) {
          console.log(`Skipping reminder for booking ${booking.booking_reference} - user disabled reminders`);
          continue;
        }

        // Get host information
        const { data: hostProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', booking.events.host_id)
          .single();

        const hostName = hostProfile?.full_name || 'Your Host';
        const guestName = booking.guest_name || 'Guest';
        const guestEmail = booking.guest_email;

        if (!guestEmail) {
          console.warn(`No email found for booking ${booking.booking_reference}`);
          continue;
        }

        // Format location
        const location = booking.events.location;
        let locationString = 'Location to be confirmed';
        if (location && typeof location === 'object') {
          if ('address' in location) {
            locationString = location.address as string;
          } else if ('name' in location) {
            locationString = location.name as string;
          }
        }

        // Format date
        const eventDate = new Date(booking.events.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Create HTML email content
        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Event Reminder</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #fff; }
                .header { background: #f8f9fa; padding: 20px; text-align: center; border-bottom: 1px solid #ddd; }
                .content { padding: 20px; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
                .event-details { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 16px; margin: 16px 0; border-radius: 4px; }
                h1, h2, h3 { color: #333; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Provaa</h1>
                </div>
                <div class="content">
                  <h2>Hello ${guestName}!</h2>
                  <p>This is a friendly reminder that you have an event coming up tomorrow:</p>
                  
                  <div class="event-details">
                    <h3>Event Details</h3>
                    <ul>
                      <li><strong>Event:</strong> ${booking.events.title}</li>
                      <li><strong>Date:</strong> ${eventDate}</li>
                      <li><strong>Time:</strong> ${booking.events.time}</li>
                      <li><strong>Location:</strong> ${locationString}</li>
                      <li><strong>Host:</strong> ${hostName}</li>
                      <li><strong>Booking Reference:</strong> ${booking.booking_reference}</li>
                    </ul>
                  </div>
                  
                  ${booking.events.meeting_point_details ? `
                    <p><strong>Meeting Point Details:</strong></p>
                    <p>${booking.events.meeting_point_details}</p>
                  ` : ''}
                  
                  <p>We look forward to seeing you there!</p>
                  <p>If you have any questions, please don't hesitate to contact us.</p>
                </div>
                <div class="footer">
                  <p>This is an automated reminder from Provaa.</p>
                  <p>If you need to cancel your booking, please contact us as soon as possible.</p>
                </div>
              </div>
            </body>
          </html>
        `;

        // Send email
        const { error: emailError } = await resend.emails.send({
          from: 'Provaa <reminders@provaa.co>',
          to: [guestEmail],
          subject: `Reminder: ${booking.events.title} is tomorrow!`,
          html: emailHtml,
        });

        if (emailError) {
          console.error(`Failed to send reminder for booking ${booking.booking_reference}:`, emailError);
          emailsFailed++;
        } else {
          console.log(`Reminder sent successfully for booking ${booking.booking_reference}`);
          emailsSent++;
        }

      } catch (error) {
        console.error(`Error processing booking ${booking.booking_reference}:`, error);
        emailsFailed++;
      }
    }

    console.log(`Reminder email job completed. Sent: ${emailsSent}, Failed: ${emailsFailed}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Reminder emails processed', 
        sent: emailsSent,
        failed: emailsFailed,
        total: bookings.length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in send-event-reminders function:', error);
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
