import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TicketSelector } from './booking/TicketSelector';
import { PriceSummary } from './booking/PriceSummary';
import { GuestCheckoutSection } from './booking/GuestCheckoutSection';
import { BookingDetailsSection } from './booking/BookingDetailsSection';
import { RegistrationModal } from './booking/RegistrationModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatPriceOnly } from '@/utils/priceUtils';
import { useBookingForm } from "./booking/hooks/useBookingForm";

interface BookingFormProps {
  eventId: string;
  price: number;
  spotsLeft: number;
  onSuccess?: () => void;
}

export function BookingForm({ eventId, price, spotsLeft, onSuccess }: BookingFormProps) {
  const { user } = useAuth();
  const { 
    form, 
    totalAmount, 
    isSubmitting, 
    showRegistrationModal,
    setShowRegistrationModal,
    onSubmit,
    handleRegistrationSuccess
  } = useBookingForm({
    eventId,
    price,
    spotsLeft,
    onSuccess
  });

  const formValues = form.watch();

  const handleRegistrationClick = () => {
    setShowRegistrationModal(true);
  };

  // Wrapper function to match the expected signature
  const handleRegistrationWrapper = () => {
    const userData = {
      id: 'temp-id',
      email: formValues.guestEmail || '',
      full_name: formValues.guestName || '',
      phone: formValues.guestPhone || ''
    };
    handleRegistrationSuccess(userData);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <TicketSelector form={form} spotsLeft={spotsLeft} />

          <PriceSummary price={price} totalAmount={totalAmount} />

          {!user && <GuestCheckoutSection form={form} />}

          <BookingDetailsSection form={form} />

          <Button 
            type="submit" 
            className="w-full bg-emerald-700 hover:bg-emerald-800"
            disabled={isSubmitting || spotsLeft <= 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : spotsLeft <= 0 ? (
              "Sold Out"
            ) : user ? (
              `Book Now - ${formatPriceOnly(totalAmount)}`
            ) : (
              `Continue to Payment - ${formatPriceOnly(totalAmount)}`
            )}
          </Button>
        </form>
      </Form>

      <RegistrationModal
        isOpen={showRegistrationModal}
        onOpenChange={setShowRegistrationModal}
        onSuccess={handleRegistrationWrapper}
        prefilledData={{
          name: formValues.guestName || '',
          email: formValues.guestEmail || '',
          phone: formValues.guestPhone || ''
        }}
      />
    </>
  );
}
