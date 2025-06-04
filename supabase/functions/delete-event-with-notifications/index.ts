
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeleteEventRequest {
  eventId: string;
  deletionReason: string;
  customMessage?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    const { eventId, deletionReason, customMessage }: DeleteEventRequest = await req.json();

    console.log('Starting event deletion process for event:', eventId);

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

    // Get event details to verify ownership and gather information
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .eq('host_id', user.id)
      .single();

    if (eventError || !event) {
      throw new Error('Event not found or you do not have permission to delete it');
    }

    console.log('Event found:', event.title);

    // Get all confirmed bookings for this event
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('event_id', eventId)
      .eq('status', 'confirmed');

    if (bookingsError) {
      throw new Error('Failed to fetch event bookings');
    }

    console.log(`Found ${bookings?.length || 0} bookings to process`);

    let totalRefundAmount = 0;
    const emailPromises: Promise<any>[] = [];

    // Process each booking
    for (const booking of bookings || []) {
      // Update booking status to cancelled
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', booking.id);

      if (updateError) {
        console.error('Error updating booking:', booking.id, updateError);
        continue;
      }

      totalRefundAmount += Number(booking.total_amount);

      // Prepare cancellation email
      const emailPromise = resend.emails.send({
        from: 'Events <noreply@yourdomain.com>',
        to: [booking.guest_email || 'unknown@email.com'],
        subject: `Event Cancelled: ${event.title}`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h2 style="color: #dc2626;">Event Cancellation Notice</h2>
            
            <p>Dear ${booking.guest_name || 'Guest'},</p>
            
            <p>We regret to inform you that the following event has been cancelled:</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0;">${event.title}</h3>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${event.time}</p>
              <p style="margin: 5px 0;"><strong>Booking Reference:</strong> ${booking.booking_reference}</p>
            </div>
            
            <p><strong>Reason for cancellation:</strong> ${deletionReason}</p>
            
            ${customMessage ? `
              <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Message from the host:</strong></p>
                <p style="margin: 10px 0 0 0;">${customMessage}</p>
              </div>
            ` : ''}
            
            <h3 style="color: #059669;">Refund Information</h3>
            <p>You will receive a full refund of <strong>$${booking.total_amount}</strong> for your ${booking.number_of_tickets} ticket(s). The refund will be processed within 5-7 business days to your original payment method.</p>
            
            <p>We sincerely apologize for any inconvenience this may cause. If you have any questions, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>The Events Team</p>
          </div>
        `,
      });

      emailPromises.push(emailPromise);
    }

    // Send all emails
    try {
      await Promise.all(emailPromises);
      console.log('All cancellation emails sent successfully');
    } catch (emailError) {
      console.error('Some emails failed to send:', emailError);
      // Continue with deletion even if some emails fail
    }

    // Log the deletion in event_deletions table
    const { error: logError } = await supabase
      .from('event_deletions')
      .insert({
        event_id: eventId,
        event_title: event.title,
        host_id: user.id,
        deletion_reason: deletionReason,
        custom_message: customMessage,
        attendee_count: bookings?.length || 0,
        total_refund_amount: totalRefundAmount
      });

    if (logError) {
      console.error('Error logging deletion:', logError);
    }

    // Finally, delete the event
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (deleteError) {
      throw new Error('Failed to delete event: ' + deleteError.message);
    }

    console.log('Event deletion process completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Event deleted successfully',
        attendeesNotified: bookings?.length || 0,
        totalRefundAmount
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
    console.error('Error in delete-event-with-notifications:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
