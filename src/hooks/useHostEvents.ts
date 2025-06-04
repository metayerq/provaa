
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface EventBookingStats {
  confirmed_tickets: number;
  actual_revenue: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  capacity: number;
  spots_left: number;
  price: number;
  category: string;
  location: any;
  created_at: string;
  booking_stats: EventBookingStats;
}

export const useHostEvents = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('host_id', user?.id)
        .order('date', { ascending: true });

      if (eventsError) throw eventsError;

      // Fetch booking stats for each event
      const eventsWithStats = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { data: bookingStats, error: bookingError } = await supabase
            .from('bookings')
            .select('number_of_tickets, total_amount')
            .eq('event_id', event.id)
            .eq('status', 'confirmed');

          if (bookingError) {
            console.error('Error fetching booking stats:', bookingError);
            return {
              ...event,
              booking_stats: {
                confirmed_tickets: 0,
                actual_revenue: 0
              }
            };
          }

          const confirmed_tickets = bookingStats?.reduce((sum, booking) => sum + booking.number_of_tickets, 0) || 0;
          const actual_revenue = bookingStats?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;

          return {
            ...event,
            booking_stats: {
              confirmed_tickets,
              actual_revenue
            }
          };
        })
      );

      setEvents(eventsWithStats);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error Loading Events",
        description: error.message || "Failed to load your events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  return { events, loading, refetchEvents: fetchEvents };
};
