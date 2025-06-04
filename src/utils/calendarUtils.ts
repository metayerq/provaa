import type { Booking } from '@/types/booking';

/**
 * Generates a Google Calendar URL for a booking
 * This is a utility function to test the calendar integration
 */
export const generateGoogleCalendarUrl = (booking: Booking): string | null => {
  try {
    const event = booking.event;
    if (!event || !event.date || !event.time || !event.title) {
      return null;
    }

    // Parse the event date and time
    const startDate = new Date(`${event.date}T${event.time}`);
    
    // Check if the date is valid
    if (isNaN(startDate.getTime())) {
      return null;
    }

    const endDate = new Date(startDate.getTime() + 2.5 * 60 * 60 * 1000); // 2.5 hours duration

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

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch (error) {
    console.error('Error generating calendar URL:', error);
    return null;
  }
};

/**
 * Creates a sample booking for testing purposes
 */
export const createSampleBooking = (): Booking => {
  return {
    id: 'test-booking-1',
    booking_reference: 'PRV-TEST123',
    event_id: 'e1',
    user_id: 'user-123',
    guest_name: 'John Doe',
    guest_email: 'john@example.com',
    guest_phone: '+1234567890',
    number_of_tickets: 2,
    price_per_ticket: 75,
    total_amount: 150,
    dietary_restrictions: 'Vegetarian',
    special_requests: 'Window seat preferred',
    status: 'confirmed',
    payment_method: 'stripe',
    created_at: new Date().toISOString(),
    event: {
      id: 'e1',
      title: 'Natural Wine Tasting Experience',
      date: '2025-06-15',
      time: '19:30',
      location: {
        venue: 'Urban Vineyard Lounge',
        city: 'Barcelona'
      },
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
      host_id: 'host-1'
    }
  };
};

/**
 * Test function to validate the Google Calendar URL generation
 */
export const testCalendarUrlGeneration = () => {
  const sampleBooking = createSampleBooking();
  const url = generateGoogleCalendarUrl(sampleBooking);
  
  console.log('=== Google Calendar URL Test ===');
  console.log('Sample Booking:', sampleBooking);
  console.log('Generated URL:', url);
  
  if (url) {
    console.log('✅ URL generated successfully');
    
    // Parse the URL to verify the components
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    
    console.log('URL Components:');
    console.log('- Title:', params.get('text'));
    console.log('- Dates:', params.get('dates'));
    console.log('- Location:', params.get('location'));
    console.log('- Details:', params.get('details'));
    
    return true;
  } else {
    console.log('❌ Failed to generate URL');
    return false;
  }
}; 