
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PaymentErrorStateProps {
  bookingRef: string | null;
  onNavigateHome: () => void;
  onContactSupport: () => void;
}

export const PaymentErrorState: React.FC<PaymentErrorStateProps> = ({
  bookingRef,
  onNavigateHome,
  onContactSupport
}) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-red-600">Payment Issue</CardTitle>
        <p className="text-gray-600 mt-2">There was an issue processing your payment</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-sm text-red-800">
            We encountered an issue while processing your payment or confirming your booking.
            {bookingRef && (
              <>
                <br />
                Your booking reference is: <strong>{bookingRef}</strong>
              </>
            )}
          </p>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Please contact our support team for assistance. If you were charged, we'll help resolve this immediately.</p>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onNavigateHome}
            className="flex-1"
          >
            Back to Events
          </Button>
          <Button 
            onClick={onContactSupport}
            className="flex-1 bg-emerald-700 hover:bg-emerald-800"
          >
            Contact Support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
