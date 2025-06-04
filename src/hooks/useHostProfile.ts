
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HostProfile {
  id: string;
  full_name: string;
  rating: number | null;
  review_count: number;
  host_story: string | null;
  credentials: string | null;
  languages_spoken: string[] | null;
  profile_photo_url: string | null;
}

export const useHostProfile = (hostId: string) => {
  const [hostProfile, setHostProfile] = useState<HostProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, rating, review_count, host_story, credentials, languages_spoken, profile_photo_url')
          .eq('id', hostId)
          .single();

        if (error) throw error;
        setHostProfile(data);
      } catch (error) {
        console.error('Error fetching host profile:', error);
        setHostProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (hostId) {
      fetchHostProfile();
    }
  }, [hostId]);

  return { hostProfile, loading };
};
