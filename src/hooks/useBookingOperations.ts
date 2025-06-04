
import type { Booking } from '@/types/booking';
import { useBookingCancellation } from './useBookingCancellation';
import { useBookingActions } from './useBookingActions';
import { useBookingValidation } from './useBookingValidation';

export const useBookingOperations = (
  bookings: Booking[], 
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
  const { cancelBooking, cancellingBookingId } = useBookingCancellation(bookings, setBookings);
  const { addToCalendar, downloadTicket } = useBookingActions();
  const { canCancelBooking, getCancellationDeadline, getTimeUntilCancellationDeadline } = useBookingValidation();

  return {
    cancelBooking,
    addToCalendar,
    downloadTicket,
    canCancelBooking,
    getCancellationDeadline,
    getTimeUntilCancellationDeadline,
    cancellingBookingId
  };
};
