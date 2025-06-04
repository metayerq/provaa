
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventDetailsProps {
  title: string;
  formatDate: (date: string) => string;
  date: string;
  time: string;
  duration: string;
  location: {
    venue: string;
    city: string;
  };
  description: string;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  title,
  formatDate,
  date,
  time,
  duration,
  location,
  description,
}) => {
  return (
    <>
      <div className="flex flex-wrap gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center text-gray-700">
          <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
          <span className="font-medium">{formatDate(date)}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Clock className="h-5 w-5 mr-2 text-emerald-600" />
          <span className="font-medium">{time}, {duration}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
          <span className="font-medium">{location.venue}, {location.city}</span>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">The Experience</h2>
        <div className="prose max-w-none">
          <p className="text-xl text-gray-800 leading-relaxed font-light mb-6 font-serif italic">
            {description.split('.')[0]}.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {description.split('.').slice(1).join('.').trim()}
          </p>
        </div>
      </div>
    </>
  );
};
