
import React from 'react';
import { Shield, CreditCard, Lock } from 'lucide-react';

export const PaymentMethodInfo: React.FC = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-5 w-5 text-emerald-600" />
        <span className="font-medium text-gray-900">Secure In-App Payment</span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span>Pay securely without leaving Provaa</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span>Your payment information is encrypted and secure</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Powered by Stripe • PCI DSS compliant
        </p>
      </div>
    </div>
  );
};
