
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';

interface DeleteEventInfoCardsProps {
  eventTitle: string;
  eventDate: string;
  attendeeCount: number;
  totalRevenue: number;
}

export const DeleteEventInfoCards: React.FC<DeleteEventInfoCardsProps> = ({
  eventTitle,
  eventDate,
  attendeeCount,
  totalRevenue
}) => {
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Event Details</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{eventTitle}</p>
                <p className="text-sm text-gray-600">{formattedDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {attendeeCount} {attendeeCount === 1 ? 'Attendee' : 'Attendees'}
                </p>
                <p className="text-sm text-gray-600">Will be notified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">${totalRevenue}</p>
                <p className="text-sm text-gray-600">Total to be refunded</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Immediate</p>
                <p className="text-sm text-gray-600">Processing time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
