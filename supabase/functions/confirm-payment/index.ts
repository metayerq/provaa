
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

    const { paymentIntentId } = await req.json();

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Get the booking
      const { data: existingBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .single();

      if (fetchError) {
        throw new Error(`Failed to fetch booking: ${fetchError.message}`);
      }

      // Check if already processed
      if (existingBooking.status === 'confirmed' && existingBooking.spots_decremented) {
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

      // Decrement event spots
      const { error: updateError } = await supabase.rpc('increment_event_spots', {
        event_id: existingBooking.event_id,
        spots_to_add: -existingBooking.number_of_tickets
      });

      if (updateError) {
        throw new Error(`Failed to update event spots: ${updateError.message}`);
      }

      // Update booking status
      const { data: booking, error: bookingUpdateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          spots_decremented: true
        })
        .eq('id', existingBooking.id)
        .select('*')
        .single();

      if (bookingUpdateError) {
        // Revert spots if booking update fails
        await supabase.rpc('increment_event_spots', {
          event_id: existingBooking.event_id,
          spots_to_add: existingBooking.number_of_tickets
        });
        throw new Error(`Failed to update booking: ${bookingUpdateError.message}`);
      }

      // Send confirmation email
      try {
        await supabase.functions.invoke('send-booking-confirmation', {
          body: { bookingId: booking.id }
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
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
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Payment not completed',
          status: paymentIntent.status
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
