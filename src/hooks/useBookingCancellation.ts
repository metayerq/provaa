import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { emailAutomationService } from '@/services/emailAutomation/EmailAutomationService';
import type { Booking } from '@/types/booking';

export const useBookingCancellation = (
  bookings: Booking[], 
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
  const { toast } = useToast();
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  const fallbackCancellation = async (bookingId: string) => {
    // Get booking details first
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, event:event_id(*)')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    // Update booking status to cancelled
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        payment_status: 'refund_pending'
      })
      .eq('id', bookingId);

    if (updateError) {
      throw new Error('Failed to update booking status');
    }

    // Restore event spots if they were decremented
    if (booking.spots_decremented) {
      const { error: eventUpdateError } = await supabase.rpc('increment_event_spots', {
        event_id: booking.event_id,
        spots_to_add: booking.number_of_tickets
      });

      if (eventUpdateError) {
        console.error('⚠️ Failed to restore event spots:', eventUpdateError);
      } else {
        console.log('✅ Event spots restored');
      }
    }

    // Send cancellation email
    try {
      console.log('📧 Sending booking cancellation email...');
      await emailAutomationService.sendBookingCancellationEmail(
        bookingId, 
        booking.total_amount
      );
      console.log('✅ Cancellation email sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send cancellation email:', emailError);
      // Don't fail the cancellation if email fails
    }

    // Update local state
    const cancelledAt = new Date().toISOString();
    setBookings(prevBookings => 
      prevBookings.map(b => 
        b.id === bookingId 
          ? { 
              ...b, 
              status: 'cancelled',
              cancelled_at: cancelledAt,
              payment_status: 'refund_pending'
            } 
          : b
      )
    );
  };

  const cancelBooking = async (bookingId: string) => {
    console.log('=== BOOKING CANCELLATION WITH REFUND DEBUG ===');
    console.log('🎯 cancelBooking called with bookingId:', bookingId);
    setCancellingBookingId(bookingId);
    console.log('🔄 Set cancellingBookingId to:', bookingId);
    
    try {
      // First try to process refund through Stripe edge function
      console.log('💳 Step 1: Processing Stripe refund...');
      const { data: refundData, error: refundError } = await supabase.functions.invoke('process-stripe-refund', {
        body: { 
          bookingId: bookingId,
          reason: 'requested_by_customer'
        }
      });

      if (refundError) {
        console.error('❌ Refund function error:', refundError);
        
        // Fallback: Update booking status without Stripe refund
        console.log('🔄 Attempting fallback cancellation without Stripe refund...');
        await fallbackCancellation(bookingId);
        
        toast({
          title: 'Booking cancelled',
          description: 'Your booking has been cancelled and you will receive an email confirmation. However, we could not process the automatic refund. Please contact support for manual refund processing.',
          variant: 'destructive',
        });
        
        return;
      }

      if (!refundData?.success) {
        console.error('❌ Refund failed:', refundData?.error);
        
        if (refundData?.stripe_error) {
          console.log('🔄 Stripe refund failed, attempting fallback cancellation...');
          await fallbackCancellation(bookingId);
          
          toast({
            title: 'Booking cancelled',
            description: 'Your booking has been cancelled and you will receive an email confirmation. However, we could not process the automatic refund. Please contact support for manual refund processing.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error cancelling booking',
            description: refundData?.error || 'Failed to cancel booking. Please try again or contact support.',
            variant: 'destructive',
          });
        }
        
        return;
      }

      console.log('✅ Refund processed successfully:', refundData);

      // Send cancellation confirmation email
      try {
        console.log('📧 Sending booking cancellation email...');
        await emailAutomationService.sendBookingCancellationEmail(
          bookingId, 
          refundData.amount_refunded
        );
        console.log('✅ Cancellation email sent successfully');
      } catch (emailError) {
        console.error('❌ Failed to send cancellation email:', emailError);
        // Don't fail the cancellation if email fails
      }

      // Update local state to reflect the cancellation
      console.log('📊 Step 2: Updating local state...');
      const cancelledAt = new Date().toISOString();
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { 
                ...booking, 
                status: 'cancelled',
                cancelled_at: cancelledAt,
                payment_status: 'refunded'
              } 
            : booking
        )
      );

      console.log('✅ Local state updated successfully');

      // Show appropriate message based on whether DB update succeeded
      if (refundData.db_update_success) {
        toast({
          title: 'Booking cancelled and refunded',
          description: `Your refund of €${refundData.amount_refunded} will appear in your account within 5-10 business days. You will receive an email confirmation shortly.`,
        });
      } else {
        toast({
          title: 'Booking cancelled and refunded',
          description: `Your refund of €${refundData.amount_refunded} has been processed successfully and will appear in your account within 5-10 business days. You will receive an email confirmation shortly.`,
        });
      }

      console.log('🎉 Cancellation and refund process completed successfully');

    } catch (error: any) {
      console.error('❌ Cancel booking with refund error:', error);
      
      // Fallback: Update booking status without Stripe refund
      try {
        console.log('🔄 Attempting fallback cancellation without Stripe refund...');
        await fallbackCancellation(bookingId);
        
        toast({
          title: 'Booking cancelled',
          description: 'Your booking has been cancelled. However, we could not process the automatic refund. Please contact support for manual refund processing.',
          variant: 'destructive',
        });
      } catch (fallbackError) {
        console.error('❌ Fallback cancellation also failed:', fallbackError);
        
        toast({
          title: 'Error cancelling booking',
          description: 'Failed to cancel booking. Please contact support for assistance.',
          variant: 'destructive',
        });
        
        throw fallbackError;
      }
    } finally {
      console.log('🧹 Cleanup: Setting cancellingBookingId to null');
      setCancellingBookingId(null);
    }
  };

  return {
    cancelBooking,
    cancellingBookingId
  };
};
