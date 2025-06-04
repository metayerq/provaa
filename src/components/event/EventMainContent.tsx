
import React from 'react';
import { Event } from '@/utils/mockData';
import { EnhancedCulinaryEventProducts } from './EnhancedCulinaryEventProducts';
import { MeetYourHost } from '@/components/host/MeetYourHost';
import { EventDescriptionSection } from './EventDescriptionSection';
import { EventLocation } from './EventLocation';

interface EventMainContentProps {
  event: Event;
}

export const EventMainContent: React.FC<EventMainContentProps> = ({ event }) => {
  return (
    <div className="lg:col-span-3">
      {/* Section 1: The Experience */}
      <EventDescriptionSection 
        description={event.description}
        ambianceDescription={event.ambianceDescription}
      />
      
      {/* Section 2: What You'll Taste - Only render if products exist */}
      {event.products && event.products.length > 0 && (
        <EnhancedCulinaryEventProducts 
          products={event.products} 
        />
      )}
      
      {/* Section 3: Meet Your Host */}
      <MeetYourHost host={event.host} />
      
      {/* Section 4: Location */}
      <EventLocation 
        venue={event.location.venue}
        address={event.location.address}
        city={event.location.city}
      />
    </div>
  );
};
