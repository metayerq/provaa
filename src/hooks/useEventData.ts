
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface EventLocation {
  venue_name?: string;
  address?: string;
  city?: string;
  is_online?: boolean;
}

interface ProductData {
  name: string;
  producer: string;
  year: string;
  description: string;
  type: string;
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  capacity: number;
  price: number;
  image: string;
  location: EventLocation;
  ambiance_description: string;
  food_pairings: string;
  accessibility_info: string;
  dress_code: string;
  dietary_options: string[];
  meeting_point_details: string;
  cancellation_policy: string;
  meta_title: string;
  meta_description: string;
  og_image_url: string;
  host_id: string;
  created_at: string;
  updated_at: string;
  status?: 'live' | 'draft' | 'paused' | 'cancelled';
  products?: ProductData[];
}

interface HostData {
  host_story: string;
  credentials: string;
  languages_spoken: string[];
  profile_photo_url: string;
}

export const useEventData = (eventId: string | undefined) => {
  const [event, setEvent] = useState<EventData | null>(null);
  const [hostData, setHostData] = useState<HostData | null>(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        console.log('🔍 Fetching event data for ID:', eventId);

        // Fetch event
        const { data: rawEventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .eq('host_id', user.id)
          .single();

        if (eventError) {
          console.error('❌ Event fetch error:', eventError);
          throw eventError;
        }

        console.log('✅ Raw event data fetched:', {
          id: rawEventData.id,
          title: rawEventData.title,
          hasImage: !!rawEventData.image,
          imageUrl: rawEventData.image,
          hasProducts: !!rawEventData.products,
          productsLength: rawEventData.products?.length || 0,
          status: rawEventData.status
        });

        // Safely parse the location data with proper type checking
        let locationData: EventLocation = {};
        if (rawEventData.location && typeof rawEventData.location === 'object') {
          const loc = rawEventData.location as any;
          locationData = {
            venue_name: loc.venue_name || loc.venueName || '',
            address: loc.address || '',
            city: loc.city || '',
            is_online: loc.is_online || loc.isOnline || false
          };
        }

        // Parse products data
        let productsData: ProductData[] = [];
        if (rawEventData.products && Array.isArray(rawEventData.products)) {
          productsData = rawEventData.products.map((product: any) => ({
            name: product.name || '',
            producer: product.producer || '',
            year: product.year || '',
            description: product.description || '',
            type: product.type || ''
          }));
        }

        console.log('📦 Parsed products:', productsData);

        // Safely parse status with type checking and fallback
        const getValidStatus = (status: any): 'live' | 'draft' | 'paused' | 'cancelled' => {
          if (typeof status === 'string' && ['live', 'draft', 'paused', 'cancelled'].includes(status)) {
            return status as 'live' | 'draft' | 'paused' | 'cancelled';
          }
          return 'live'; // Default fallback
        };

        // Transform the raw data to match our interface
        const transformedEvent: EventData = {
          id: rawEventData.id,
          title: rawEventData.title || '',
          description: rawEventData.description || '',
          category: rawEventData.category || '',
          date: rawEventData.date,
          time: rawEventData.time || '',
          duration: rawEventData.duration || '',
          capacity: rawEventData.capacity || 10,
          price: rawEventData.price || 0,
          image: rawEventData.image || '',
          location: locationData,
          ambiance_description: rawEventData.ambiance_description || '',
          food_pairings: rawEventData.food_pairings || '',
          accessibility_info: rawEventData.accessibility_info || '',
          dress_code: rawEventData.dress_code || '',
          dietary_options: rawEventData.dietary_options || [],
          meeting_point_details: rawEventData.meeting_point_details || '',
          cancellation_policy: rawEventData.cancellation_policy || '',
          meta_title: rawEventData.meta_title || '',
          meta_description: rawEventData.meta_description || '',
          og_image_url: rawEventData.og_image_url || '',
          host_id: rawEventData.host_id,
          created_at: rawEventData.created_at,
          updated_at: rawEventData.updated_at,
          status: getValidStatus(rawEventData.status),
          products: productsData
        };

        console.log('🔄 Transformed event data:', {
          id: transformedEvent.id,
          title: transformedEvent.title,
          hasImage: !!transformedEvent.image,
          imageUrl: transformedEvent.image,
          productsCount: transformedEvent.products?.length || 0,
          status: transformedEvent.status
        });

        // Fetch host profile
        const { data: hostProfile, error: hostError } = await supabase
          .from('profiles')
          .select('host_story, credentials, languages_spoken, profile_photo_url')
          .eq('id', user.id)
          .single();

        if (hostError) {
          console.error('❌ Host profile fetch error:', hostError);
          throw hostError;
        }

        // Fetch booking count
        const { count, error: bookingError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', eventId)
          .neq('status', 'cancelled');

        if (bookingError) {
          console.error('❌ Booking count fetch error:', bookingError);
          throw bookingError;
        }

        console.log('✅ Event data loading complete');
        setEvent(transformedEvent);
        setHostData(hostProfile);
        setBookingCount(count || 0);
      } catch (error: any) {
        console.error('❌ Error fetching event data:', error);
        toast({
          title: "Error Loading Event",
          description: error.message || "Failed to load event data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, user, toast]);

  return { event, hostData, bookingCount, isLoading, setEvent };
};
