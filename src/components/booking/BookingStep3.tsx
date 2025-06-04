import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useBooking } from '@/contexts/BookingContext';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatPriceOnly } from '@/utils/priceUtils';

interface BookingStep3Props {
  onPaymentRedirect?: () => void;
}

export const BookingStep3: React.FC<BookingStep3Props> = ({ onPaymentRedirect }): JSX.Element => {
  const { bookingData, setCurrentStep } = useBooking();
  const { user } = useAuth();
  const { toast } = useToast();
  const [agreeToCancellation, setAgreeToCancellation] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleBack = () => {
    setCurrentStep(2);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handlePaymentClick = async () => {
    if (!agreeToCancellation) {
      toast({
        title: 'Please agree to cancellation policy',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessingPayment(true);
    
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        attempt++;
        console.log(`🚀 Payment attempt ${attempt}/${maxRetries}...`);
        
        // Show progress to user
        if (attempt === 1) {
          toast({
            title: 'Processing payment...',
            description: 'Setting up secure checkout...',
          });
        } else {
          toast({
            title: `Retrying payment... (${attempt}/${maxRetries})`,
            description: 'Previous attempt failed, trying again...',
          });
        }

        // Invoke the create-stripe-checkout edge function
        const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
          body: {
            eventId: bookingData.eventId,
            numberOfTickets: bookingData.numberOfTickets,
            pricePerTicket: bookingData.price,
            totalAmount: bookingData.totalAmount,
            guestInfo: bookingData.guestInfo,
            dietaryRestrictions: bookingData.dietaryRestrictions,
            specialRequests: bookingData.specialRequests,
          },
          headers: user ? {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          } : {},
        });

        if (error) {
          throw new Error(error.message || 'Failed to create checkout session');
        }

        if (!data || !data.url) {
          throw new Error('No checkout URL received');
        }

        // SUCCESS! 🎉
        console.log('✅ Checkout session created, redirecting to Stripe...');
        
        toast({
          title: 'Redirecting to Payment',
          description: 'Opening secure payment page...',
        });

        // Call any payment redirect callback to close any modals on mobile
        if (onPaymentRedirect) {
          onPaymentRedirect();
        }

        // Redirect to Stripe checkout
        window.location.href = data.url;
        return; // Exit retry loop on success

      } catch (error: any) {
        console.error(`❌ Payment attempt ${attempt} failed:`, error);
        
        if (attempt >= maxRetries) {
          // All attempts failed
          console.error('💥 All payment attempts failed');
          
          toast({
            title: 'Payment Error',
            description: error.message || 'Failed to start payment process. Please try again.',
            variant: 'destructive',
          });
          break;
          
        } else {
          // Wait before retrying (exponential backoff)
          const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
          console.log(`⏳ Waiting ${delay/1000} seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    setIsProcessingPayment(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Review & Pay</h2>
        <div className="h-0.5 bg-gray-200 mb-6"></div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">ORDER SUMMARY</h3>
        <div className="space-y-2 text-sm">
          <p className="font-medium">{bookingData.eventTitle}</p>
          <p className="text-gray-600">
            {formatDate(bookingData.date)} • {bookingData.time}-{bookingData.duration}
          </p>
          <div className="flex justify-between pt-2">
            <span>{bookingData.numberOfTickets} ticket × {formatPriceOnly(bookingData.price)}</span>
            <span>{formatPriceOnly(bookingData.numberOfTickets * bookingData.price)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>{formatPriceOnly(bookingData.serviceFee)}</span>
          </div>
          <hr className="border-gray-300" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPriceOnly(bookingData.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">PAYMENT METHOD</h3>
        <div className="p-4 border-2 border-emerald-700 bg-emerald-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-700" />
            <span className="font-medium text-emerald-700">Secure Payment with Stripe</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            You'll be redirected to Stripe's secure payment page to complete your purchase.
          </p>
        </div>
      </div>

      {/* Terms */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">TERMS</h3>
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreeToCancellation}
            onCheckedChange={(checked) => setAgreeToCancellation(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm">
            I agree to the cancellation policy<br />
            <span className="text-gray-500">(Free cancellation up to 48h before)</span>
          </Label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex-1"
          disabled={isProcessingPayment}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handlePaymentClick}
          disabled={!agreeToCancellation || isProcessingPayment}
          className="flex-1 bg-emerald-700 hover:bg-emerald-800"
        >
          {isProcessingPayment ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Payment...
            </>
          ) : (
            `Pay €${bookingData.totalAmount.toFixed(2)} with Stripe`
          )}
        </Button>
      </div>
    </div>
  );
};
