
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface BookingDetails {
  booking_reference: string;
  number_of_tickets: number;
  total_amount: number;
}

interface PaymentSuccessStateProps {
  booking: BookingDetails | null;
  authRestored: boolean;
  onNavigateHome: () => void;
  onViewBookings: () => void;
}

export const PaymentSuccessState: React.FC<PaymentSuccessStateProps> = ({
  booking,
  authRestored,
  onNavigateHome,
  onViewBookings
}) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
        <p className="text-gray-600 mt-2">Your booking has been confirmed</p>
        {authRestored && (
          <p className="text-sm text-emerald-600 mt-1">Welcome back! You're now logged in.</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {booking && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Booking Reference:</strong> {booking.booking_reference}</p>
              <p><strong>Number of Tickets:</strong> {booking.number_of_tickets}</p>
              <p><strong>Total Amount:</strong> €{Number(booking.total_amount).toFixed(2)}</p>
              <p><strong>Status:</strong> <span className="text-green-600 font-medium">Confirmed</span></p>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-600">
          <p>A confirmation email will be sent to you shortly.</p>
          <p className="mt-2">You can view your booking details in your profile.</p>
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
            onClick={onViewBookings}
            className="flex-1 bg-emerald-700 hover:bg-emerald-800"
          >
            View My Bookings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
