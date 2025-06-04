
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useBookingOperations } from './useBookingOperations';

export const usePaymentErrorRecovery = () => {
  const { toast } = useToast();
  const { fixOrphanedBooking, findConfirmedBooking, transformBookingData } = useBookingOperations();

  const handleErrorRecovery = async (bookingRef: string | null, error: any) => {
    console.error('❌ Payment verification error:', error);
    
    // Enhanced error recovery for mobile
    if (bookingRef) {
      try {
        const existingBooking = await findConfirmedBooking(bookingRef);
        
        if (existingBooking) {
          console.log('✅ Found confirmed booking during error recovery');
          
          const { data: { user } } = await supabase.auth.getUser();
          if (user && !existingBooking.user_id) {
            console.log('🔧 Fixing orphaned booking during error recovery...');
            const fixed = await fixOrphanedBooking(bookingRef, user.id);
            if (fixed) {
              console.log('✅ Successfully linked booking during recovery');
              toast({
                title: 'Payment Successful!',
                description: `Your booking ${existingBooking.booking_reference} has been confirmed and added to your account.`,
              });
            } else {
              toast({
                title: 'Payment Successful!',
                description: `Your booking ${existingBooking.booking_reference} has been confirmed.`,
              });
            }
          } else {
            toast({
              title: 'Payment Successful!',
              description: `Your booking ${existingBooking.booking_reference} has been confirmed.`,
            });
          }
          
          return transformBookingData(existingBooking);
        } else {
          throw error;
        }
      } catch (bookingCheckError) {
        console.error('❌ Could not find confirmed booking:', bookingCheckError);
        toast({
          title: 'Payment Issue',
          description: 'There was an issue confirming your booking. Please contact support if you were charged.',
          variant: 'destructive',
        });
        return { error: error.message };
      }
    } else {
      toast({
        title: 'Payment Issue',
        description: 'There was an issue confirming your booking. Please contact support if you were charged.',
        variant: 'destructive',
      });
      return { error: error.message };
    }
  };

  const handleTimeoutRecovery = async (bookingRef: string | null) => {
    console.warn('⚠️ Payment verification timeout on mobile');
    if (bookingRef) {
      try {
        const existingBooking = await findConfirmedBooking(bookingRef);
        
        if (existingBooking) {
          console.log('✅ Found confirmed booking after timeout');
          
          const { data: { user } } = await supabase.auth.getUser();
          if (user && !existingBooking.user_id) {
            console.log('🔧 Fixing orphaned booking during timeout recovery...');
            await fixOrphanedBooking(bookingRef, user.id);
          }
          
          return transformBookingData(existingBooking);
        }
        throw new Error('Timeout and no confirmed booking found');
      } catch {
        return { error: 'Verification timeout - please contact support' };
      }
    } else {
      return { error: 'Verification timeout - please contact support' };
    }
  };

  return {
    handleErrorRecovery,
    handleTimeoutRecovery
  };
};
