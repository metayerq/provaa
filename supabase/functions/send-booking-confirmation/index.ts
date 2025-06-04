import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { BookingConfirmationEmail } from './_templates/booking-confirmation.tsx';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  bookingId: string;
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

    const { bookingId }: BookingEmailRequest = await req.json();

    console.log('Sending booking confirmation email for booking:', bookingId);

    // Get booking details with event and host information
    const { data: booking, error: bookingError } = await supabase
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
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    // Get host information
    const { data: hostProfile, error: hostError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', booking.events.host_id)
      .single();

    if (hostError) {
      console.warn('Could not fetch host profile:', hostError);
    }

    const hostName = hostProfile?.full_name || 'Your Host';
    const guestName = booking.guest_name || 'Guest';
    const guestEmail = booking.guest_email;

    if (!guestEmail) {
      throw new Error('No guest email found for booking');
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

    // Render email template
    const emailHtml = await renderAsync(
      React.createElement(BookingConfirmationEmail, {
        guestName,
        eventTitle: booking.events.title,
        eventDate,
        eventTime: booking.events.time,
        eventLocation: locationString,
        numberOfTickets: booking.number_of_tickets,
        totalAmount: Number(booking.total_amount),
        bookingReference: booking.booking_reference,
        hostName,
        dietaryRestrictions: booking.dietary_restrictions,
        specialRequests: booking.special_requests,
      })
    );

    // Send email using verified provaa.co domain
    const { error: emailError } = await resend.emails.send({
      from: 'Provaa <bookings@provaa.co>',
      to: [guestEmail],
      subject: `Booking Confirmed: ${booking.events.title}`,
      html: emailHtml,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      
      // Provide helpful error messages
      let errorMessage = emailError.message || 'Unknown email error';
      if (errorMessage.includes('domain is not verified')) {
        errorMessage = 'Domain verification issue. Please verify the provaa.co domain in your Resend dashboard.';
      } else if (errorMessage.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait before sending more emails.';
      }
      
      throw new Error(errorMessage);
    }

    console.log('Booking confirmation email sent successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error sending booking confirmation email:', error);
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
