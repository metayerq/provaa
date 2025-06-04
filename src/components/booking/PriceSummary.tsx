
import React from 'react';

interface PriceSummaryProps {
  price: number;
  totalAmount: number;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({ price, totalAmount }) => {
  return (
    <div className="py-2">
      <div className="flex justify-between font-medium text-sm mb-2">
        <span>Price per ticket</span>
        <span>${price.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Total amount</span>
        <span className="text-emerald-700">${totalAmount.toFixed(2)}</span>
      </div>
    </div>
  );
};
