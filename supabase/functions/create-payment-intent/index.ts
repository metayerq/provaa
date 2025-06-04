
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

    const { 
      eventId, 
      numberOfTickets, 
      pricePerTicket, 
      totalAmount, 
      guestInfo,
      dietaryRestrictions,
      specialRequests 
    } = await req.json();

    // Get user if authenticated
    let user = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabase.auth.getUser(token);
      user = data.user;
    }

    // Check if there are enough spots available
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('spots_left, capacity')
      .eq('id', eventId)
      .single();

    if (eventError) {
      throw new Error(`Failed to fetch event: ${eventError.message}`);
    }

    if (eventData.spots_left < numberOfTickets) {
      throw new Error(`Not enough spots available. Only ${eventData.spots_left} spots left.`);
    }

    // Create booking record with pending status
    const bookingData = {
      event_id: eventId,
      user_id: user?.id || null,
      guest_name: guestInfo?.name || null,
      guest_email: guestInfo?.email || null,
      guest_phone: guestInfo?.phone || null,
      number_of_tickets: numberOfTickets,
      price_per_ticket: pricePerTicket,
      total_amount: totalAmount,
      dietary_restrictions: dietaryRestrictions || null,
      special_requests: specialRequests || null,
      payment_status: 'pending',
      status: 'pending'
    };

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select('id, booking_reference')
      .single();

    if (bookingError) {
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'eur',
      metadata: {
        booking_id: booking.id,
        booking_reference: booking.booking_reference,
        event_id: eventId,
      },
    });

    // Update booking with payment intent ID
    await supabase
      .from('bookings')
      .update({ 
        stripe_payment_intent_id: paymentIntent.id,
        payment_method: 'stripe'
      })
      .eq('id', booking.id);

    return new Response(
      JSON.stringify({ 
        client_secret: paymentIntent.client_secret,
        booking_reference: booking.booking_reference 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
