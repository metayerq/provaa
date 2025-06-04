
export interface BookingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: {
    venue: string;
    city: string;
  };
  image?: string;
  host_id?: string;
}

export interface Booking {
  id: string;
  booking_reference: string;
  event_id: string;
  user_id?: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  number_of_tickets: number;
  price_per_ticket: number;
  total_amount: number;
  dietary_restrictions?: string;
  special_requests?: string;
  status: string;
  payment_method?: string;
  payment_method_used?: string;
  created_at: string;
  cancelled_at?: string;
  event: BookingEvent;
}
