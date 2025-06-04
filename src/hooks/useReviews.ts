
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Review {
  id: string;
  booking_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

export const useReviews = (bookingIds: string[]) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    if (!user || bookingIds.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, booking_id, rating, review_text, created_at')
        .eq('user_id', user.id)
        .in('booking_id', bookingIds);

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [user, bookingIds.join(',')]);

  const hasReview = (bookingId: string) => {
    return reviews.some(review => review.booking_id === bookingId);
  };

  return { reviews, loading, hasReview, refetchReviews: fetchReviews };
};
