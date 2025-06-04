
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface HostReview {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  user: {
    full_name: string;
  };
  event: {
    id: string;
    title: string;
    date: string;
  };
  booking: {
    id: string;
    user_id: string;
  };
}

export const useHostReviews = (eventId?: string) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<HostReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      let query = supabase
        .from('reviews')
        .select(`
          id,
          rating,
          review_text,
          created_at,
          booking:bookings!inner(
            id,
            user_id
          ),
          event:events!inner(
            id,
            title,
            date
          )
        `)
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data: reviewsData, error } = await query;

      if (error) throw error;

      if (reviewsData) {
        // Fetch user data separately for each review
        const reviewsWithUsers = await Promise.all(
          reviewsData.map(async (review) => {
            const { data: userData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', review.booking.user_id)
              .single();

            return {
              ...review,
              user: userData || { full_name: 'Anonymous' }
            };
          })
        );

        setReviews(reviewsWithUsers);
      }
    } catch (error) {
      console.error('Error fetching host reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [user, eventId]);

  return { reviews, loading, refetchReviews: fetchReviews };
};
