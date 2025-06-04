
import { format } from 'date-fns';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface BookingCardDetailsProps {
  eventDate?: string;
  eventTime?: string;
  eventLocation?: {
    venue: string;
    city: string;
  };
}

export const BookingCardDetails: React.FC<BookingCardDetailsProps> = ({
  eventDate,
  eventTime,
  eventLocation
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
        {formatDate(eventDate || '')}
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Clock className="h-4 w-4 mr-2 text-emerald-600" />
        {eventTime}
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
        {eventLocation?.venue}, {eventLocation?.city}
      </div>
    </div>
  );
};
