
import React from 'react';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/contexts/BookingContext';
import { Check, Calendar, Mail } from 'lucide-react';

interface BookingStep5Props {
  onClose: () => void;
}

export const BookingStep5: React.FC<BookingStep5Props> = ({ onClose }) => {
  const { bookingData, resetBooking } = useBooking();

  const handleViewBooking = () => {
    resetBooking();
    onClose();
    // Navigate to bookings page
  };

  const handleFindMore = () => {
    resetBooking();
    onClose();
    // Navigate to events page
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600 mb-2">Reference:</div>
        <div className="font-mono font-bold text-lg">{bookingData.bookingReference}</div>
      </div>

      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center justify-center gap-2">
          <Mail className="h-4 w-4" />
          <span>We've sent confirmation to:</span>
        </div>
        <div className="font-medium text-gray-900">
          {bookingData.guestInfo?.email}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg text-left">
        <h3 className="font-semibold text-blue-900 mb-3">What's next:</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Full address sent 24h before</li>
          <li className="flex items-center gap-2">
            • Add to calendar 
            <Calendar className="h-4 w-4" />
          </li>
          <li>• Contact host option available</li>
        </ul>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button
          onClick={handleViewBooking}
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          View My Booking
        </Button>
        <Button
          variant="outline"
          onClick={handleFindMore}
        >
          Find More Experiences
        </Button>
      </div>
    </div>
  );
};
