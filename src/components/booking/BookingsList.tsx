
import { BookingCard } from './BookingCard';
import { EmptyState } from './EmptyState';
import type { Booking } from '@/types/booking';

interface BookingsListProps {
  bookings: Booking[];
  activeTab: string;
  onCancel: (bookingId: string) => Promise<void>;
  onAddToCalendar: (booking: Booking) => void;
  onDownloadTicket: (booking: Booking) => void;
  canCancelBooking: (booking: Booking) => boolean;
  cancellingBookingId: string | null;
  getTimeUntilCancellationDeadline?: (booking: Booking) => string | null;
  emptyStateType: 'upcoming' | 'past' | 'cancelled';
  hasReview?: (bookingId: string) => boolean;
  onRateExperience?: (booking: Booking) => void;
}

export const BookingsList: React.FC<BookingsListProps> = ({
  bookings,
  activeTab,
  onCancel,
  onAddToCalendar,
  onDownloadTicket,
  canCancelBooking,
  cancellingBookingId,
  getTimeUntilCancellationDeadline,
  emptyStateType,
  hasReview,
  onRateExperience
}) => {
  if (bookings.length === 0) {
    return <EmptyState type={emptyStateType} />;
  }

  return (
    <div className="space-y-6">
      {bookings.map(booking => (
        <BookingCard 
          key={booking.id} 
          booking={booking}
          activeTab={activeTab}
          onCancel={onCancel}
          onAddToCalendar={onAddToCalendar}
          onDownloadTicket={onDownloadTicket}
          canCancel={canCancelBooking(booking)}
          isCancelling={cancellingBookingId === booking.id}
          getTimeUntilCancellationDeadline={getTimeUntilCancellationDeadline}
          hasReview={hasReview ? hasReview(booking.id) : false}
          onRateExperience={onRateExperience}
        />
      ))}
    </div>
  );
};
