
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { EventUpdateEmail } from './_templates/event-update.tsx';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EventUpdateRequest {
  eventId: string;
  updateMessage: string;
  changedFields: string[];
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

    const { eventId, updateMessage, changedFields }: EventUpdateRequest = await req.json();

    console.log('Sending event update emails for event:', eventId);

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      throw new Error('Event not found');
    }

    // Get host information
    const { data: hostProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', event.host_id)
      .single();

    const hostName = hostProfile?.full_name || 'Your Host';

    // Get all confirmed bookings for this event
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('event_id', eventId)
      .eq('status', 'confirmed');

    if (bookingsError) {
      throw new Error(`Failed to fetch bookings: ${bookingsError.message}`);
    }

    console.log(`Found ${bookings?.length || 0} bookings to notify`);

    if (!bookings || bookings.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No attendees to notify', count: 0 }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    let emailsSent = 0;
    let emailsFailed = 0;

    // Send update email to each attendee
    for (const booking of bookings) {
      try {
        // Check if user wants update emails
        let sendUpdate = true;
        
        if (booking.user_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email_notifications')
            .eq('id', booking.user_id)
            .single();

          if (profile?.email_notifications && 
              typeof profile.email_notifications === 'object' && 
              'updates' in profile.email_notifications) {
            sendUpdate = profile.email_notifications.updates === true;
          }
        }

        if (!sendUpdate) {
          console.log(`Skipping update for booking ${booking.booking_reference} - user disabled updates`);
          continue;
        }

        const guestName = booking.guest_name || 'Guest';
        const guestEmail = booking.guest_email;

        if (!guestEmail) {
          console.warn(`No email found for booking ${booking.booking_reference}`);
          continue;
        }

        // Format location
        const location = event.location;
        let locationString = 'Location to be confirmed';
        if (location && typeof location === 'object') {
          if ('address' in location) {
            locationString = location.address as string;
          } else if ('name' in location) {
            locationString = location.name as string;
          }
        }

        // Format date
        const eventDate = new Date(event.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Render email template
        const emailHtml = await renderAsync(
          React.createElement(EventUpdateEmail, {
            guestName,
            eventTitle: event.title,
            eventDate,
            eventTime: event.time,
            eventLocation: locationString,
            bookingReference: booking.booking_reference,
            hostName,
            updateMessage,
            changedFields,
          })
        );

        // Send email
        const { error: emailError } = await resend.emails.send({
          from: 'Provaa <updates@provaa.co>',
          to: [guestEmail],
          subject: `Event Update: ${event.title}`,
          html: emailHtml,
        });

        if (emailError) {
          console.error(`Failed to send update for booking ${booking.booking_reference}:`, emailError);
          emailsFailed++;
        } else {
          console.log(`Update sent successfully for booking ${booking.booking_reference}`);
          emailsSent++;
        }

      } catch (error) {
        console.error(`Error processing booking ${booking.booking_reference}:`, error);
        emailsFailed++;
      }
    }

    console.log(`Event update emails completed. Sent: ${emailsSent}, Failed: ${emailsFailed}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Update emails processed', 
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
    console.error('Error in send-event-updates function:', error);
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
