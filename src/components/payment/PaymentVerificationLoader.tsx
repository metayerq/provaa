
import React from 'react';
import { Button } from '@/components/ui/button';

interface PaymentVerificationLoaderProps {
  authRestored: boolean;
  onCancel: () => void;
}

export const PaymentVerificationLoader: React.FC<PaymentVerificationLoaderProps> = ({
  authRestored,
  onCancel
}) => {
  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
      <p className="text-gray-600">Please wait while we confirm your payment and restore your session...</p>
      {authRestored && (
        <p className="text-sm text-green-600 mt-2">✅ Authentication restored successfully</p>
      )}
      <div className="mt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="text-sm"
        >
          Cancel and Return Home
        </Button>
      </div>
    </div>
  );
};
