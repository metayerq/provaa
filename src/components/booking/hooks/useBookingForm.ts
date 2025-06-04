
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingFormSchema, BookingFormData, getDefaultFormValues } from './useBookingFormSchema';
import { usePaymentCalculations } from './usePaymentCalculations';
import { useEmailAutomation } from './useEmailAutomation';
import { useStripeCheckout } from './useStripeCheckout';

interface UseBookingFormProps {
  eventId: string;
  price: number;
  spotsLeft: number;
  onSuccess?: () => void;
}

export function useBookingForm({ eventId, price, spotsLeft, onSuccess }: UseBookingFormProps) {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: getDefaultFormValues()
  });

  const numberOfTickets = form.watch('numberOfTickets');
  
  const { totalAmount } = usePaymentCalculations({ numberOfTickets, price });
  const { handleRegistrationSuccess: handleEmailRegistration } = useEmailAutomation();
  const { isSubmitting, createCheckoutSession } = useStripeCheckout({
    eventId,
    price,
    spotsLeft,
    totalAmount,
    onSuccess
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await createCheckoutSession(data, numberOfTickets);
  });

  const handleRegistrationSuccess = async (userData: { id: string; email: string; full_name: string; phone?: string }) => {
    await handleEmailRegistration(userData);

    setShowRegistrationModal(false);
    
    form.setValue('guestName', userData.full_name);
    form.setValue('guestEmail', userData.email);
    form.setValue('guestPhone', userData.phone || '');
  };

  return {
    form,
    totalAmount,
    isSubmitting,
    showRegistrationModal,
    setShowRegistrationModal,
    onSubmit,
    handleRegistrationSuccess
  };
}
