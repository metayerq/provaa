import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Star, Check } from 'lucide-react';
import { CancelBookingDialog } from './CancelBookingDialog';
import { CannotCancelDialog } from './CannotCancelDialog';
import type { Booking } from '@/types/booking';

interface BookingCardActionsProps {
  booking: Booking;
  activeTab: string;
  onCancel: (bookingId: string) => Promise<void>;
  onAddToCalendar: (booking: Booking) => void;
  canCancel: boolean;
  isCancelling: boolean;
  hasReview?: boolean;
  onRateExperience?: (booking: Booking) => void;
}

export const BookingCardActions: React.FC<BookingCardActionsProps> = ({
  booking,
  activeTab,
  onCancel,
  onAddToCalendar,
  canCancel,
  isCancelling,
  hasReview = false,
  onRateExperience
}) => {
  console.log('=== BookingCardActions DEBUG ===');
  console.log('Booking ID:', booking.id);
  console.log('Can cancel:', canCancel);
  console.log('Is cancelling:', isCancelling);
  console.log('Active tab:', activeTab);
  console.log('Has review:', hasReview);

  const handleBookingCancel = async () => {
    console.log('🎯 BookingCardActions handleBookingCancel called for booking:', booking.id);
    await onCancel(booking.id);
  };

  const handleRateExperience = () => {
    if (onRateExperience) {
      onRateExperience(booking);
    }
  };

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {activeTab === 'upcoming' && booking.status !== 'cancelled' && (
        <>
          <Link to={`/events/${booking.event_id}`}>
            <Button variant="outline" size="sm">
              View Event
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAddToCalendar(booking)}
            className="inline-flex items-center"
          >
            <CalendarPlus className="h-4 w-4 mr-1" />
            Add to Calendar
          </Button>
          
          {/* Show appropriate cancel dialog based on whether cancellation is allowed */}
          {canCancel ? (
            <CancelBookingDialog
              eventTitle={booking.event?.title || ''}
              eventDate={booking.event?.date || ''}
              eventTime={booking.event?.time || ''}
              totalAmount={booking.total_amount}
              onCancel={handleBookingCancel}
              isLoading={isCancelling}
            />
          ) : (
            <CannotCancelDialog
              eventTitle={booking.event?.title || ''}
              eventDate={booking.event?.date || ''}
              eventTime={booking.event?.time || ''}
            />
          )}
        </>
      )}
      
      {activeTab === 'past' && (
        <>
          {hasReview ? (
            <Button 
              variant="outline" 
              size="sm" 
              disabled
              className="inline-flex items-center text-green-600"
            >
              <Check className="h-4 w-4 mr-1" />
              Review Submitted ✓
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRateExperience}
              className="inline-flex items-center"
            >
              <Star className="h-4 w-4 mr-1" />
              Rate Experience
            </Button>
          )}
        </>
      )}
    </div>
  );
};
