import React from 'react';
import EventCard from '@/components/EventCard';
import ExperienceCard from '@/components/ExperienceCard';
import { Event } from '@/utils/mockData';

interface EventsGridProps {
  events: Event[];
  totalEvents: number;
}

const EventsGrid = ({ events, totalEvents }: EventsGridProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          {totalEvents === 0 ? 'No events available yet.' : 'No events match your current filters.'}
        </div>
        {totalEvents === 0 && (
          <p className="text-gray-400 mt-2">Be the first to create an event!</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <ExperienceCard
          key={event.id}
          id={event.id}
          title={event.title}
          date={event.date}
          time={event.time}
          location={{
            venue_name: event.location.venue,
            city: event.location.city
          }}
          price={event.price}
          capacity={event.capacity}
          spots_left={event.spotsLeft}
          host_name={event.host.name}
          host_image={event.host.image}
          image={event.image}
          category={event.category}
        />
      ))}
    </div>
  );
};

export default EventsGrid;
