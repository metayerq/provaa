
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RefundRequest {
  bookingId: string;
  reason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get the current user from the auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication token');
    }

    const { bookingId, reason = 'requested_by_customer' }: RefundRequest = await req.json();

    console.log('🔄 Processing refund for booking:', bookingId);

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', user.id) // Ensure user owns this booking
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found or you do not have permission to refund it');
    }

    if (booking.status === 'cancelled') {
      throw new Error('Booking is already cancelled');
    }

    if (!booking.stripe_payment_intent_id) {
      throw new Error('No payment intent found for this booking');
    }

    console.log('💳 Found booking with payment intent:', booking.stripe_payment_intent_id);

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: booking.stripe_payment_intent_id,
      amount: Math.round(booking.total_amount * 100), // Convert to cents
      reason: reason as any,
      metadata: {
        booking_id: booking.id,
        booking_reference: booking.booking_reference,
        user_id: user.id
      }
    });

    console.log('✅ Stripe refund created:', refund.id);

    // Update booking with refund information
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        payment_status: 'refunded',
        stripe_refund_id: refund.id
      })
      .eq('id', bookingId);

    let dbUpdateSuccess = true;
    if (updateError) {
      console.error('⚠️ Error updating booking after successful refund:', updateError);
      dbUpdateSuccess = false;
    }

    // Increment event spots back
    if (booking.spots_decremented) {
      const { error: eventUpdateError } = await supabase.rpc('increment_event_spots', {
        event_id: booking.event_id,
        spots_to_add: booking.number_of_tickets
      });

      if (eventUpdateError) {
        console.error('⚠️ Failed to update event spots after refund:', eventUpdateError);
        // Don't fail the refund if spots update fails
      } else {
        console.log('✅ Event spots updated after refund');
      }
    }

    console.log('🎉 Stripe refund process completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        refund_id: refund.id,
        amount_refunded: refund.amount / 100, // Convert back to dollars
        db_update_success: dbUpdateSuccess,
        message: dbUpdateSuccess 
          ? 'Refund processed successfully'
          : 'Refund processed successfully, but database update failed'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('❌ Error in process-stripe-refund:', error);
    
    // Distinguish between Stripe errors and other errors
    const isStripeError = error.type && error.type.startsWith('Stripe');
    
    return new Response(
      JSON.stringify({ 
        success: false,
        stripe_error: isStripeError,
        error: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
