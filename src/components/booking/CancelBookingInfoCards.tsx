
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CreditCard, AlertTriangle } from 'lucide-react';

interface CancelBookingInfoCardsProps {
  totalAmount: number;
}

export const CancelBookingInfoCards: React.FC<CancelBookingInfoCardsProps> = ({
  totalAmount
}) => {
  return (
    <div className="grid gap-3">
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-emerald-800 text-sm">Automatic Refund</p>
              <p className="text-emerald-700 text-xs mt-1">
                Your refund of <strong>€{totalAmount}</strong> will be processed automatically through Stripe and appear in your account within 5-10 business days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800 text-sm">Processing Time</p>
              <p className="text-blue-700 text-xs mt-1">
                Refunds are processed immediately but may take 5-10 business days to appear in your account depending on your bank.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-orange-800 text-sm">Important Notice</p>
              <p className="text-orange-700 text-xs mt-1">
                This action cannot be undone. Once cancelled, you'll need to make a new booking if you change your mind.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
