
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SearchSuggestion, SearchResponse } from '@/types/search';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useSearchSuggestions = (query: string) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedQuery = useDebounce(query.trim(), 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const searchSuggestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const allSuggestions: SearchSuggestion[] = [];

        // Search for hosts and guests in profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, user_type, avatar_url')
          .ilike('full_name', `%${debouncedQuery}%`)
          .limit(5);

        if (profilesError) throw profilesError;

        profiles?.forEach((profile) => {
          if (profile.full_name) {
            allSuggestions.push({
              id: profile.id,
              type: profile.user_type === 'host' ? 'host' : 'guest',
              title: profile.full_name,
              subtitle: profile.user_type === 'host' ? 'Host' : 'Guest',
              icon: profile.user_type === 'host' ? '🏠' : '👤',
              url: `/profile/${profile.id}`
            });
          }
        });

        // Search for experiences in events
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('id, title, category, location')
          .or(`title.ilike.%${debouncedQuery}%,category.ilike.%${debouncedQuery}%`)
          .limit(8);

        if (eventsError) throw eventsError;

        events?.forEach((event) => {
          allSuggestions.push({
            id: event.id,
            type: 'experience',
            title: event.title,
            subtitle: event.category || 'Experience',
            icon: '🍽️',
            url: `/events/${event.id}`
          });
        });

        // Search for locations
        const { data: locationEvents, error: locationError } = await supabase
          .from('events')
          .select('location')
          .not('location', 'is', null)
          .limit(20);

        if (locationError) throw locationError;

        const locationSuggestions = new Set<string>();
        locationEvents?.forEach((event) => {
          const location = event.location as any;
          if (location?.city && location.city.toLowerCase().includes(debouncedQuery.toLowerCase())) {
            locationSuggestions.add(location.city);
          }
          if (location?.venue_name && location.venue_name.toLowerCase().includes(debouncedQuery.toLowerCase())) {
            locationSuggestions.add(location.venue_name);
          }
        });

        Array.from(locationSuggestions).slice(0, 5).forEach((locationName, index) => {
          allSuggestions.push({
            id: `location-${index}`,
            type: 'location',
            title: locationName,
            subtitle: 'Location',
            icon: '📍',
            url: `/events?location=${encodeURIComponent(locationName)}`
          });
        });

        setSuggestions(allSuggestions.slice(0, 12));
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch search suggestions');
      } finally {
        setLoading(false);
      }
    };

    searchSuggestions();
  }, [debouncedQuery]);

  return { suggestions, loading, error };
};
