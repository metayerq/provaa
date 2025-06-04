import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import { useBookingOperations } from '@/hooks/useBookingOperations';
import { useReviews } from '@/hooks/useReviews';
import { MyBookingsHeader } from '@/components/booking/MyBookingsHeader';
import { MyBookingsContent } from '@/components/booking/MyBookingsContent';
import { RatingModal } from '@/components/rating/RatingModal';
import type { Booking } from '@/types/booking';

const MyBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<Booking | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const { 
    cancelBooking, 
    addToCalendar, 
    canCancelBooking, 
    getTimeUntilCancellationDeadline,
    cancellingBookingId 
  } = useBookingOperations(bookings, setBookings);

  const bookingIds = bookings.map(booking => booking.id);
  const { reviews, hasReview, refetchReviews } = useReviews(bookingIds);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            event:event_id (
              id, 
              title, 
              date, 
              time, 
              location,
              image,
              host_id
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const typedData = data.map((item: any) => ({
          ...item,
          booking_reference: item.booking_reference.replace('BK-', 'PRV-'),
        })) as Booking[];

        setBookings(typedData);
      } catch (error: any) {
        toast({
          title: 'Error loading bookings',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, toast]);

  // Filter bookings by status and search term
  const filterBookings = (status: 'upcoming' | 'past' | 'cancelled') => {
    const now = new Date();
    
    return bookings.filter(booking => {
      const eventDate = new Date(booking.event?.date || '');
      const matchesSearch = searchTerm === '' || 
        booking.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      switch (status) {
        case 'upcoming':
          return booking.status === 'confirmed' && eventDate >= now;
        case 'past':
          return booking.status === 'confirmed' && eventDate < now;
        case 'cancelled':
          return booking.status === 'cancelled';
        default:
          return false;
      }
    });
  };

  const handleRateExperience = (booking: Booking) => {
    setSelectedBookingForRating(booking);
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmitted = () => {
    refetchReviews();
    setSelectedBookingForRating(null);
  };

  // Get host name for the selected booking
  const getHostName = async (hostId: string): Promise<string> => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', hostId)
        .single();
      return data?.full_name || 'Host';
    } catch {
      return 'Host';
    }
  };

  const [hostName, setHostName] = useState('Host');

  useEffect(() => {
    if (selectedBookingForRating?.event?.host_id) {
      getHostName(selectedBookingForRating.event.host_id).then(setHostName);
    }
  }, [selectedBookingForRating]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <MyBookingsHeader 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <MyBookingsContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            filterBookings={filterBookings}
            onCancel={cancelBooking}
            onAddToCalendar={addToCalendar}
            canCancelBooking={canCancelBooking}
            cancellingBookingId={cancellingBookingId}
            getTimeUntilCancellationDeadline={getTimeUntilCancellationDeadline}
            hasReview={hasReview}
            onRateExperience={handleRateExperience}
          />
        )}

        {selectedBookingForRating && (
          <RatingModal
            isOpen={isRatingModalOpen}
            onOpenChange={setIsRatingModalOpen}
            booking={selectedBookingForRating}
            hostName={hostName}
            onRatingSubmitted={handleRatingSubmitted}
          />
        )}
      </div>
    </Layout>
  );
};

export default MyBookings;
