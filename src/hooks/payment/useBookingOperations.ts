
import { supabase } from '@/integrations/supabase/client';

export const useBookingOperations = () => {
  const fixOrphanedBooking = async (bookingReference: string, userId: string): Promise<boolean> => {
    try {
      console.log('🔧 Attempting to fix orphaned booking:', bookingReference, 'for user:', userId);
      
      const { data, error } = await supabase.rpc('fix_orphaned_booking', {
        booking_ref: bookingReference,
        target_user_id: userId
      });

      if (error) {
        console.error('❌ Error fixing orphaned booking:', error);
        return false;
      }

      console.log('✅ Successfully fixed orphaned booking:', data);
      return data;
    } catch (error) {
      console.error('❌ Exception fixing orphaned booking:', error);
      return false;
    }
  };

  const findConfirmedBooking = async (bookingRef: string) => {
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_reference', bookingRef)
      .eq('status', 'confirmed')
      .single();
    
    return existingBooking;
  };

  const transformBookingData = (booking: any) => {
    return {
      booking_reference: booking.booking_reference,
      number_of_tickets: booking.number_of_tickets,
      total_amount: booking.total_amount
    };
  };

  return {
    fixOrphanedBooking,
    findConfirmedBooking,
    transformBookingData
  };
};
