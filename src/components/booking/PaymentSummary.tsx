import React from 'react';
import { formatPriceOnly } from '@/utils/priceUtils';

interface PaymentSummaryProps {
  numberOfTickets: number;
  pricePerTicket: number;
  totalAmount: number;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  numberOfTickets,
  pricePerTicket,
  totalAmount
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>{numberOfTickets} ticket × {formatPriceOnly(pricePerTicket)}</span>
          <span>{formatPriceOnly(numberOfTickets * pricePerTicket)}</span>
        </div>
        <div className="flex justify-between">
          <span>Service fee</span>
          <span>{formatPriceOnly(totalAmount - (numberOfTickets * pricePerTicket))}</span>
        </div>
        <hr className="border-gray-300" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPriceOnly(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};
