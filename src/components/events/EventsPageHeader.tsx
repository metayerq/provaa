
import React from 'react';

interface EventsPageHeaderProps {
  title: string;
  description?: string;
}

const EventsPageHeader = ({ title }: EventsPageHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
    </div>
  );
};

export default EventsPageHeader;
