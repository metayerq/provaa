
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { BookingFormData } from './useBookingFormSchema';

interface UseStripeCheckoutProps {
  eventId: string;
  price: number;
  spotsLeft: number;
  totalAmount: number;
  onSuccess?: () => void;
}

export function useStripeCheckout({ 
  eventId, 
  price, 
  spotsLeft, 
  totalAmount, 
  onSuccess 
}: UseStripeCheckoutProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createCheckoutSession = useCallback(async (
    data: BookingFormData,
    numberOfTickets: number
  ) => {
    if (spotsLeft <= 0) {
      toast({
        title: "Event Full",
        description: "Sorry, this event is now fully booked.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🚀 Starting external Stripe checkout process...');
      
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('date')
        .eq('id', eventId)
        .single();

      if (eventError) {
        throw new Error(`Failed to fetch event data: ${eventError.message}`);
      }

      // Create Stripe Checkout Session via edge function
      const { data: sessionData, error: sessionError } = await supabase
        .functions.invoke('create-stripe-checkout', {
          body: {
            eventId,
            numberOfTickets,
            pricePerTicket: price,
            totalAmount,
            guestInfo: {
              name: data.guestName,
              email: data.guestEmail,
              phone: data.guestPhone
            },
            dietaryRestrictions: data.dietaryRestrictions,
            specialRequests: data.specialRequests,
          },
          headers: user ? {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          } : {},
        });

      if (sessionError) {
        console.error('❌ Session creation error:', sessionError);
        throw new Error(sessionError.message || 'Failed to create checkout session');
      }

      if (!sessionData?.url) {
        throw new Error('No checkout URL received');
      }

      console.log('✅ Checkout session created, redirecting to Stripe...');
      
      toast({
        title: "Redirecting to Payment",
        description: "Opening Stripe checkout...",
      });

      // Redirect to Stripe Checkout
      window.location.href = sessionData.url;

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('❌ Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [eventId, price, spotsLeft, totalAmount, user, toast, onSuccess]);

  return {
    isSubmitting,
    createCheckoutSession
  };
}
