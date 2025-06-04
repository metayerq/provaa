
export interface TestResult {
  type: string;
  mode?: string;
  bookingRef?: string;
  eventTitle?: string;
  eventDate?: string;
  eventDetails?: string;
  response?: any;
  simulationNote?: string;
  error?: any;
}

export interface BookingWithEvent {
  id: string;
  booking_reference: string;
  events: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: any;
    host_id: string;
  };
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: any;
  host_id?: string;
}
