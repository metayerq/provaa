import { useEventsFetch } from './useEventsFetch';
import { useEventsFilters } from './useEventsFilters';

export const useEventsData = () => {
  const { events, loading } = useEventsFetch();
  const filterProps = useEventsFilters(events);

  // Calculate upcoming events count (excluding past events)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events.filter(event => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  return {
    events: upcomingEvents, // Return only upcoming events
    allEvents: events, // Keep all events if needed elsewhere
    loading,
    ...filterProps
  };
};
