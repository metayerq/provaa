
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: any;
  capacity: number;
  spots_left: number;
  price: number;
}

interface AttendeePageHeaderProps {
  event: EventData;
  onBackClick: () => void;
}

export const AttendeePageHeader: React.FC<AttendeePageHeaderProps> = ({
  event,
  onBackClick
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBackClick}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Events
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Attendees</h1>
          <div className="space-y-1">
            <h2 className="text-xl text-gray-700">{event.title}</h2>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(event.date), 'MMMM dd, yyyy')}</span>
              </div>
              <span>•</span>
              <span>{event.time}</span>
              <span>•</span>
              <span>{event.location?.venue || 'Location TBD'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email All
          </Button>
        </div>
      </div>
    </div>
  );
};
