import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useBooking } from '@/contexts/BookingContext';
import { Calendar, Clock, MapPin, Users, AlertTriangle } from 'lucide-react';
import { formatPriceOnly } from '@/utils/priceUtils';

export const BookingStep1: React.FC = () => {
  const { bookingData, updateBookingData, setCurrentStep } = useBooking();
  
  const handleTicketsChange = (value: number) => {
    const serviceFee = Math.round(bookingData.price * value * 0.05 * 100) / 100;
    const totalAmount = (bookingData.price * value) + serviceFee;
    
    updateBookingData({
      numberOfTickets: value,
      serviceFee,
      totalAmount
    });
  };

  const handleContinue = () => {
    setCurrentStep(2);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Event Context */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {bookingData.eventTitle}
        </h3>
        <p className="text-gray-600 mb-3">with {bookingData.hostName}</p>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(bookingData.date)} • {bookingData.time}-{bookingData.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{bookingData.location}</span>
          </div>
        </div>
      </div>

      {/* Availability Warning */}
      {bookingData.spotsLeft <= 5 && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">
            Only {bookingData.spotsLeft} spots left!
          </span>
        </div>
      )}

      {/* Number of Tickets */}
      <div>
        <Label htmlFor="numberOfTickets">Number of Tickets</Label>
        <Input
          id="numberOfTickets"
          type="number"
          min={1}
          max={bookingData.spotsLeft}
          value={bookingData.numberOfTickets}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value >= 1 && value <= bookingData.spotsLeft) {
              handleTicketsChange(value);
            }
          }}
        />
      </div>

      {/* Price Breakdown */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Price per ticket</span>
            <span>{formatPriceOnly(bookingData.price)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>{formatPriceOnly(bookingData.serviceFee)}</span>
          </div>
          <hr className="border-gray-300" />
          <div className="flex justify-between font-semibold">
            <span>Total amount</span>
            <span className="text-emerald-700">{formatPriceOnly(bookingData.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div>
        <Label htmlFor="dietaryRestrictions">Dietary Restrictions (optional)</Label>
        <Textarea
          id="dietaryRestrictions"
          placeholder="Please list any dietary restrictions or allergies"
          value={bookingData.dietaryRestrictions || ''}
          onChange={(e) => updateBookingData({ dietaryRestrictions: e.target.value })}
        />
      </div>

      {/* Special Requests */}
      <div>
        <Label htmlFor="specialRequests">Special Requests (optional)</Label>
        <Textarea
          id="specialRequests"
          placeholder="Any special requests or accommodations needed?"
          value={bookingData.specialRequests || ''}
          onChange={(e) => updateBookingData({ specialRequests: e.target.value })}
        />
      </div>

      <Button 
        onClick={handleContinue}
        className="w-full bg-emerald-700 hover:bg-emerald-800"
      >
        Continue to Details →
      </Button>
    </div>
  );
};
