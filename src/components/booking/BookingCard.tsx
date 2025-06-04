import { BookingCardImage } from './BookingCardImage';
import { BookingCardHeader } from './BookingCardHeader';
import { BookingCardDetails } from './BookingCardDetails';
import { BookingCardActions } from './BookingCardActions';
import type { Booking } from '@/types/booking';

interface BookingCardProps {
  booking: Booking;
  activeTab: string;
  onCancel: (bookingId: string) => Promise<void>;
  onAddToCalendar: (booking: Booking) => void;
  canCancel: boolean;
  isCancelling: boolean;
  getTimeUntilCancellationDeadline?: (booking: Booking) => string | null;
  hasReview?: boolean;
  onRateExperience?: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  activeTab,
  onCancel,
  onAddToCalendar,
  canCancel,
  isCancelling,
  getTimeUntilCancellationDeadline,
  hasReview = false,
  onRateExperience
}) => {
  console.log('BookingCard render - booking:', booking.id, 'canCancel:', canCancel, 'isCancelling:', isCancelling);

  const cancellationDeadlineText = getTimeUntilCancellationDeadline ? getTimeUntilCancellationDeadline(booking) : null;

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${booking.status === 'cancelled' ? 'opacity-70' : ''}`}>
      <div className="flex flex-col md:flex-row">
        <BookingCardImage 
          image={booking.event?.image}
          title={booking.event?.title}
        />
        
        <div className="p-6 flex-grow">
          <BookingCardHeader
            title={booking.event?.title}
            bookingReference={booking.booking_reference}
            createdAt={booking.created_at}
            status={booking.status}
            cancelledAt={booking.cancelled_at}
            activeTab={activeTab}
            cancellationDeadlineText={cancellationDeadlineText}
            totalAmount={booking.total_amount}
            pricePerTicket={booking.price_per_ticket}
            numberOfTickets={booking.number_of_tickets}
          />
          
          <BookingCardDetails
            eventDate={booking.event?.date}
            eventTime={booking.event?.time}
            eventLocation={booking.event?.location}
          />
          
          <BookingCardActions
            booking={booking}
            activeTab={activeTab}
            onCancel={onCancel}
            onAddToCalendar={onAddToCalendar}
            canCancel={canCancel}
            isCancelling={isCancelling}
            hasReview={hasReview}
            onRateExperience={onRateExperience}
          />
        </div>
      </div>
    </div>
  );
};
