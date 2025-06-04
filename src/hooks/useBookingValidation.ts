
import type { Booking } from '@/types/booking';

export const useBookingValidation = () => {
  const canCancelBooking = (booking: Booking) => {
    try {
      if (!booking.event?.date || !booking.event?.time) {
        console.log('❌ Missing event date or time');
        return false;
      }

      // Create a proper datetime string and parse it
      const eventDateTimeStr = `${booking.event.date}T${booking.event.time}`;
      const eventDateTime = new Date(eventDateTimeStr);
      
      // Check if the date is valid
      if (isNaN(eventDateTime.getTime())) {
        console.error('❌ Invalid event datetime:', eventDateTimeStr);
        return false;
      }

      const now = new Date();
      const hoursUntilEvent = (eventDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      console.log('📊 Cancellation eligibility check:', {
        eventDate: booking.event.date,
        eventTime: booking.event.time,
        eventDateTimeStr,
        eventDateTime: eventDateTime.toISOString(),
        now: now.toISOString(),
        hoursUntilEvent: Math.round(hoursUntilEvent * 10) / 10, // Round to 1 decimal
        canCancel: hoursUntilEvent > 48
      });
      
      return hoursUntilEvent > 48;
    } catch (error) {
      console.error('❌ Error calculating cancellation eligibility:', error);
      return false;
    }
  };

  const getCancellationDeadline = (booking: Booking) => {
    try {
      if (!booking.event?.date || !booking.event?.time) {
        return null;
      }

      const eventDateTimeStr = `${booking.event.date}T${booking.event.time}`;
      const eventDateTime = new Date(eventDateTimeStr);
      
      if (isNaN(eventDateTime.getTime())) {
        return null;
      }

      const deadline = new Date(eventDateTime.getTime() - (48 * 60 * 60 * 1000));
      return deadline;
    } catch (error) {
      console.error('❌ Error calculating cancellation deadline:', error);
      return null;
    }
  };

  const getTimeUntilCancellationDeadline = (booking: Booking) => {
    const deadline = getCancellationDeadline(booking);
    if (!deadline) return null;
    
    const now = new Date();
    const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDeadline <= 0) return 'Cancellation deadline has passed';
    if (hoursUntilDeadline < 24) return `${Math.round(hoursUntilDeadline)} hours left to cancel`;
    return `${Math.round(hoursUntilDeadline / 24)} days left to cancel`;
  };

  return {
    canCancelBooking,
    getCancellationDeadline,
    getTimeUntilCancellationDeadline
  };
};
