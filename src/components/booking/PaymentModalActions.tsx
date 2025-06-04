
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface PaymentModalActionsProps {
  onClose: () => void;
  onPay: () => void;
  isProcessing: boolean;
  totalAmount: number;
}

export const PaymentModalActions: React.FC<PaymentModalActionsProps> = ({
  onClose,
  onPay,
  isProcessing,
  totalAmount
}) => {
  return (
    <div className="flex gap-3 pt-4">
      <Button
        variant="outline"
        onClick={onClose}
        disabled={isProcessing}
        className="flex-1"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <Button
        onClick={onPay}
        disabled={isProcessing}
        className="flex-1 bg-emerald-700 hover:bg-emerald-800"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay €${totalAmount.toFixed(2)}`
        )}
      </Button>
    </div>
  );
};
