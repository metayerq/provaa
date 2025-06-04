
import React from 'react';

interface EventsStatsBarProps {
  eventCount: number;
}

const EventsStatsBar = ({ eventCount }: EventsStatsBarProps) => {
  return (
    <div className="mb-6">
      <p className="text-gray-600">
        {eventCount} event{eventCount !== 1 ? 's' : ''} found
      </p>
    </div>
  );
};

export default EventsStatsBar;
