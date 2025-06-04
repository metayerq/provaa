
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { sessionId } = await req.json();
    console.log('🔍 Processing payment verification for session:', sessionId);

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('💳 Stripe session payment status:', session.payment_status);

    if (session.payment_status === 'paid') {
      // Get the booking first to check if it's already processed
      const { data: existingBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single();

      if (fetchError) {
        console.error('❌ Failed to fetch booking:', fetchError);
        throw new Error(`Failed to fetch booking: ${fetchError.message}`);
      }

      console.log('📋 Existing booking status:', existingBooking.status);
      console.log('📊 Spots already decremented:', existingBooking.spots_decremented);

      // Check if booking is already confirmed and spots have been decremented
      if (existingBooking.status === 'confirmed' && existingBooking.spots_decremented) {
        console.log('✅ Booking already processed, returning existing booking');
        return new Response(
          JSON.stringify({ 
            success: true, 
            booking: existingBooking,
            message: 'Booking already processed'
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      // Use a transaction to ensure atomic updates
      const { data: updatedEventSpots, error: updateError } = await supabase.rpc('increment_event_spots', {
        event_id: existingBooking.event_id,
        spots_to_add: -existingBooking.number_of_tickets
      });

      if (updateError) {
        console.error('❌ Error decrementing event spots:', updateError);
        throw new Error(`Failed to update event spots: ${updateError.message}`);
      }

      console.log('✅ Successfully decremented spots by:', existingBooking.number_of_tickets);

      // Now update the booking status and mark spots as decremented
      const { data: booking, error: bookingUpdateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          stripe_payment_intent_id: session.payment_intent as string,
          spots_decremented: true // Mark that spots have been decremented
        })
        .eq('id', existingBooking.id)
        .select('*')
        .single();

      if (bookingUpdateError) {
        console.error('❌ Error updating booking:', bookingUpdateError);
        // If booking update fails after spots were decremented, we need to revert the spots
        await supabase.rpc('increment_event_spots', {
          event_id: existingBooking.event_id,
          spots_to_add: existingBooking.number_of_tickets
        });
        throw new Error(`Failed to update booking: ${bookingUpdateError.message}`);
      }

      console.log('✅ Successfully confirmed booking:', booking.booking_reference);

      // Send booking confirmation email - THIS IS THE KEY FIX
      try {
        console.log('📧 Sending booking confirmation email for booking ID:', booking.id);
        
        const emailResponse = await supabase.functions.invoke('send-booking-confirmation', {
          body: { bookingId: booking.id }
        });
        
        if (emailResponse.error) {
          console.error('❌ Failed to send booking confirmation email:', emailResponse.error);
          // Don't fail the payment verification if email fails, but log it
        } else {
          console.log('✅ Booking confirmation email sent successfully:', emailResponse.data);
        }
      } catch (emailError) {
        console.error('❌ Error sending booking confirmation email:', emailError);
        // Don't fail the payment verification if email fails
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          booking: booking 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      console.log('⚠️ Payment not completed, status:', session.payment_status);
      // Payment not completed
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Payment not completed' 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error('💥 Payment verification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
