
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from './useHostEvents';

interface EventStats {
  totalEvents: number;
  totalAttendees: number;
  totalRevenue: number;
  averageRating: number;
}

export const useHostStats = (events: Event[]) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<EventStats>({
    totalEvents: 0,
    totalAttendees: 0,
    totalRevenue: 0,
    averageRating: 0
  });

  const fetchStats = async () => {
    try {
      // Get total bookings and revenue for this month
      const currentMonth = new Date();
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          total_amount,
          number_of_tickets,
          events!inner(host_id)
        `)
        .eq('events.host_id', user?.id)
        .gte('created_at', startOfMonth.toISOString())
        .eq('status', 'confirmed');

      if (error) throw error;

      // Get reviews for average rating calculation
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('host_id', user?.id);

      if (reviewsError) throw reviewsError;

      // Calculate average rating from actual reviews
      let averageRating = 0;
      if (reviews && reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal
      }

      const totalRevenue = bookings?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;
      const totalAttendees = bookings?.reduce((sum, booking) => sum + booking.number_of_tickets, 0) || 0;

      setStats(prev => ({
        ...prev,
        totalEvents: events.filter(e => new Date(e.date) >= startOfMonth).length,
        totalAttendees,
        totalRevenue,
        averageRating
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (user && events.length > 0) {
      fetchStats();
    }
  }, [user, events]);

  return { stats, refetchStats: fetchStats };
};
