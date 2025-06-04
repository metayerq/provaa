
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HostFrequencyData {
  average_frequency_days: number | null;
  events_per_year: number | null;
  last_event_date: string | null;
  completed_events_count: number;
}

export const useHostFrequency = (hostId: string) => {
  const [frequencyData, setFrequencyData] = useState<HostFrequencyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHostFrequency = async () => {
      try {
        setIsLoading(true);
        
        // Get completed events (past events only)
        const { data: completedEvents, error: eventsError } = await supabase
          .from('events')
          .select('date')
          .eq('host_id', hostId)
          .lt('date', new Date().toISOString().split('T')[0]) // Only past events
          .order('date', { ascending: true });

        if (eventsError) throw eventsError;

        const completedEventsCount = completedEvents?.length || 0;

        if (completedEventsCount === 0) {
          setFrequencyData({
            average_frequency_days: null,
            events_per_year: null,
            last_event_date: null,
            completed_events_count: 0
          });
          return;
        }

        // Calculate frequency data from the database function
        const { data: frequencyResult, error: frequencyError } = await supabase
          .rpc('calculate_host_frequency', { host_user_id: hostId });

        if (frequencyError) throw frequencyError;

        if (frequencyResult && frequencyResult.length > 0) {
          const result = frequencyResult[0];
          setFrequencyData({
            average_frequency_days: result.avg_frequency_days,
            events_per_year: result.events_per_year,
            last_event_date: result.last_event,
            completed_events_count: completedEventsCount
          });
        } else {
          setFrequencyData({
            average_frequency_days: null,
            events_per_year: null,
            last_event_date: null,
            completed_events_count: completedEventsCount
          });
        }
      } catch (error) {
        console.error('Error fetching host frequency:', error);
        setFrequencyData({
          average_frequency_days: null,
          events_per_year: null,
          last_event_date: null,
          completed_events_count: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (hostId) {
      fetchHostFrequency();
    }
  }, [hostId]);

  return { frequencyData, isLoading };
};
