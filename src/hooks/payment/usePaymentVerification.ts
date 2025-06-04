
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthRestoration } from './useAuthRestoration';
import { useBookingOperations } from './useBookingOperations';
import { usePaymentErrorRecovery } from './usePaymentErrorRecovery';

interface BookingDetails {
  booking_reference: string;
  number_of_tickets: number;
  total_amount: number;
}

// Type guard to check if result has error property
const hasError = (result: any): result is { error: string } => {
  return result && typeof result === 'object' && 'error' in result;
};

export const usePaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [authRestored, setAuthRestored] = useState(false);

  const sessionId = searchParams.get('session_id');
  const bookingRef = searchParams.get('booking_ref');

  const { restoreAuthSession, cleanupSessionData } = useAuthRestoration();
  const { fixOrphanedBooking } = useBookingOperations();
  const { handleErrorRecovery, handleTimeoutRecovery } = usePaymentErrorRecovery();

  useEffect(() => {
    const restoreAuthAndVerifyPayment = async () => {
      console.log('🔍 Payment success page loaded from mobile/desktop');
      console.log('📍 Session ID:', sessionId);
      console.log('📍 Booking Ref:', bookingRef);

      // Restore authentication
      const restored = await restoreAuthSession();
      setAuthRestored(restored);

      // Verify payment
      if (!sessionId) {
        console.error('❌ No session ID provided');
        setVerificationError('Invalid payment session');
        toast({
          title: 'Invalid payment session',
          variant: 'destructive',
        });
        setIsVerifying(false);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        console.log('🔄 Verifying payment for session:', sessionId);
        
        const { data, error } = await supabase.functions.invoke('verify-stripe-payment', {
          body: { sessionId }
        });

        console.log('📊 Verification response:', data, error);

        if (error) {
          throw new Error(error.message || 'Payment verification failed');
        }

        if (!data.success) {
          // Check if this is a minor issue but payment succeeded
          if (data.booking && data.booking.status === 'confirmed') {
            console.log('✅ Payment successful despite minor issues');
            
            // Check if booking needs to be linked to user account
            const { data: { user } } = await supabase.auth.getUser();
            if (user && !data.booking.user_id && bookingRef) {
              console.log('🔧 Detected orphaned booking, attempting to fix...');
              const fixed = await fixOrphanedBooking(bookingRef, user.id);
              if (fixed) {
                console.log('✅ Successfully linked booking to user account');
                toast({
                  title: 'Payment Successful!',
                  description: `Your booking ${bookingRef} has been confirmed and added to your account.`,
                });
              }
            }
            
            setBooking(data.booking);
            if (!data.booking.user_id) {
              toast({
                title: 'Payment Successful!',
                description: `Your booking ${bookingRef || data.booking?.booking_reference} has been confirmed.`,
              });
            }
          } else {
            throw new Error(data.message || 'Payment verification failed');
          }
        } else {
          console.log('✅ Payment verified successfully');
          setBooking(data.booking);
          toast({
            title: 'Payment Successful!',
            description: `Your booking ${bookingRef || data.booking?.booking_reference} has been confirmed.`,
          });
        }

        // Clear any pending booking data from sessionStorage
        cleanupSessionData();
        
      } catch (error: any) {
        const result = await handleErrorRecovery(bookingRef, error);
        if (hasError(result)) {
          setVerificationError(result.error);
        } else if (result) {
          setBooking(result as BookingDetails);
        }
      } finally {
        setIsVerifying(false);
      }
    };

    // Enhanced timeout handling for mobile (20 seconds instead of 15)
    const timeout = setTimeout(async () => {
      if (isVerifying) {
        const result = await handleTimeoutRecovery(bookingRef);
        if (hasError(result)) {
          setVerificationError(result.error);
        } else if (result) {
          setBooking(result as BookingDetails);
        }
        setIsVerifying(false);
      }
    }, 20000); // 20 seconds for mobile

    restoreAuthAndVerifyPayment();

    return () => clearTimeout(timeout);
  }, [sessionId, bookingRef, navigate, toast]);

  return {
    booking,
    isVerifying,
    verificationError,
    authRestored,
    bookingRef
  };
};
