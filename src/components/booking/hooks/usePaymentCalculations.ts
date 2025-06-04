
import { useMemo } from 'react';

interface UsePaymentCalculationsProps {
  numberOfTickets: number;
  price: number;
}

export function usePaymentCalculations({ numberOfTickets, price }: UsePaymentCalculationsProps) {
  return useMemo(() => {
    const subtotal = numberOfTickets * price;
    const serviceFee = subtotal * 0.05;
    const totalAmount = subtotal + serviceFee;

    return {
      subtotal,
      serviceFee,
      totalAmount
    };
  }, [numberOfTickets, price]);
}
