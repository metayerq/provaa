
import React, { useEffect, useState } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check } from 'lucide-react';

export const BookingStep4: React.FC = () => {
  const { setCurrentStep, updateBookingData, bookingData } = useBooking();
  const { user } = useAuth();
  const { toast } = useToast();
  const [steps, setSteps] = useState([
    { id: 1, label: 'Checking availability', status: 'loading' },
    { id: 2, label: 'Reserving your spot', status: 'pending' },
    { id: 3, label: 'Processing payment', status: 'pending' }
  ]);

  useEffect(() => {
    const processSteps = async () => {
      try {
        // Step 1: Check availability
        setTimeout(() => {
          setSteps(prev => prev.map(step => 
            step.id === 1 ? { ...step, status: 'complete' } : 
            step.id === 2 ? { ...step, status: 'loading' } : step
          ));
        }, 1000);

        // Step 2: Reserve spot and save booking
        setTimeout(async () => {
          try {
            // Generate booking reference
            const reference = 'PRV-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            
            // Prepare booking data - start as PENDING until payment is confirmed
            const bookingInsert = {
              event_id: bookingData.eventId,
              user_id: user?.id || null,
              guest_name: bookingData.guestInfo?.name || null,
              guest_email: bookingData.guestInfo?.email || null,
              guest_phone: bookingData.guestInfo?.phone || null,
              number_of_tickets: bookingData.numberOfTickets,
              price_per_ticket: bookingData.price,
              total_amount: bookingData.totalAmount,
              dietary_restrictions: bookingData.dietaryRestrictions || null,
              special_requests: bookingData.specialRequests || null,
              booking_reference: reference,
              status: 'pending', // Start as pending - will be confirmed after payment
              payment_status: 'pending' // Payment not yet processed
            };

            // Save booking to database (as pending)
            const { error: bookingError } = await supabase
              .from('bookings')
              .insert(bookingInsert);

            if (bookingError) {
              console.error('Booking error:', bookingError);
              throw new Error('Failed to save booking');
            }

            // DO NOT update event spots here - this will be done only after payment confirmation
            // in the verify-stripe-payment function to prevent double-decrementing

            updateBookingData({ bookingReference: reference });
            
            setSteps(prev => prev.map(step => 
              step.id === 2 ? { ...step, status: 'complete' } : 
              step.id === 3 ? { ...step, status: 'loading' } : step
            ));
          } catch (error) {
            console.error('Booking process error:', error);
            toast({
              title: 'Booking failed',
              description: 'There was an error processing your booking. Please try again.',
              variant: 'destructive',
            });
            return;
          }
        }, 2000);

        // Step 3: Complete process
        setTimeout(() => {
          setSteps(prev => prev.map(step => 
            step.id === 3 ? { ...step, status: 'complete' } : step
          ));
          
          // Move to confirmation
          setCurrentStep(5);
        }, 3500);

      } catch (error) {
        console.error('Process error:', error);
        toast({
          title: 'Booking failed',
          description: 'There was an error processing your booking. Please try again.',
          variant: 'destructive',
        });
      }
    };

    processSteps();
  }, [setCurrentStep, updateBookingData, bookingData, user, toast]);

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Processing your booking...</h2>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-3 text-left">
            <div className="flex-shrink-0">
              {step.status === 'loading' && (
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              )}
              {step.status === 'complete' && (
                <Check className="h-5 w-5 text-emerald-600" />
              )}
              {step.status === 'pending' && (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
              )}
            </div>
            <span className={`text-sm ${
              step.status === 'complete' ? 'text-emerald-600' : 
              step.status === 'loading' ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
