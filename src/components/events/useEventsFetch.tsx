
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/utils/mockData';
import { transformSupabaseEventData } from './eventDataTransformer';

export const useEventsFetch = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events with host data from Supabase...');
        
        // First fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (eventsError) {
          console.error('Supabase events error:', eventsError);
          throw eventsError;
        }

        // Get unique host IDs
        const hostIds = [...new Set(eventsData?.map(event => event.host_id).filter(Boolean))];
        
        // Fetch profiles for these hosts with rating and image data
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, bio, profile_photo_url, avatar_url, rating, review_count')
          .in('id', hostIds);

        if (profilesError) {
          console.error('Supabase profiles error:', profilesError);
          throw profilesError;
        }

        // Create a map of host profiles for quick lookup
        const hostProfilesMap = new Map();
        profilesData?.forEach(profile => {
          hostProfilesMap.set(profile.id, profile);
        });

        console.log('Fetched events and host data:', { events: eventsData, profiles: profilesData });
        
        // Transform Supabase data to match Event interface
        const transformedEvents = transformSupabaseEventData(eventsData || [], hostProfilesMap);
        setEvents(transformedEvents);
      } catch (error: any) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error Loading Events",
          description: "There was an error loading events. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  return { events, loading };
};
