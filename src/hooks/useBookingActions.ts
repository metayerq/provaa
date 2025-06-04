import { useToast } from '@/hooks/use-toast';
import type { Booking } from '@/types/booking';

export const useBookingActions = () => {
  const { toast } = useToast();

  const addToCalendar = (booking: Booking) => {
    try {
      const event = booking.event;
      if (!event) {
        toast({
          title: 'Error',
          description: 'Event details not available',
          variant: 'destructive',
        });
        return;
      }

      if (!event.date || !event.time || !event.title) {
        toast({
          title: 'Error',
          description: 'Missing required event information',
          variant: 'destructive',
        });
        return;
      }

      // Parse the event date and time
      const startDate = new Date(`${event.date}T${event.time}`);
      
      // Check if the date is valid
      if (isNaN(startDate.getTime())) {
        toast({
          title: 'Error',
          description: 'Invalid event date or time',
          variant: 'destructive',
        });
        return;
      }

      const endDate = new Date(startDate.getTime() + 2.5 * 60 * 60 * 1000); // Assuming 2.5 hours duration

      // Format dates for Google Calendar (YYYYMMDDTHHMMSS format in local time)
      const formatGoogleCalendarDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
      };

      // Create event description with booking details
      const description = [
        `Booking Reference: ${booking.booking_reference}`,
        `Number of Tickets: ${booking.number_of_tickets}`,
        `Total Amount: €${booking.total_amount}`,
        '',
        booking.special_requests ? `Special Requests: ${booking.special_requests}` : '',
        booking.dietary_restrictions ? `Dietary Restrictions: ${booking.dietary_restrictions}` : ''
      ].filter(Boolean).join('\n');

      // Create location string
      const location = event.location 
        ? `${event.location.venue || ''}, ${event.location.city || ''}`.replace(/^,\s*|,\s*$/g, '') 
        : '';

      // Build Google Calendar URL with proper encoding
      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        dates: `${formatGoogleCalendarDate(startDate)}/${formatGoogleCalendarDate(endDate)}`,
        details: description,
        location: location,
        sf: 'true',
        output: 'xml'
      });

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;

      // Open Google Calendar in a new tab
      window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');

      toast({
        title: 'Opening Google Calendar',
        description: 'Google Calendar will open with your event details pre-filled.',
      });
    } catch (error) {
      console.error('Error generating calendar event:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate calendar event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const downloadTicket = (booking: Booking) => {
    toast({
      title: 'Ticket downloading',
      description: 'Your ticket will be available 24 hours before the event',
    });
  };

  return {
    addToCalendar,
    downloadTicket
  };
};
