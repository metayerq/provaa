
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Star,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

interface EventBookingStats {
  confirmed_tickets: number;
  actual_revenue: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  capacity: number;
  spots_left: number;
  price: number;
  category: string;
  location: any;
  created_at: string;
  booking_stats: EventBookingStats;
}

interface HostEventsMobileViewProps {
  events: Event[];
  onEventAction: (action: string, eventId: string) => void;
  highlightedEventId?: string | null;
  isDuplicating?: boolean;
}

export const HostEventsMobileView: React.FC<HostEventsMobileViewProps> = ({
  events,
  onEventAction,
  highlightedEventId,
  isDuplicating
}) => {
  const getEventStatus = (event: Event) => {
    // Check if it's a draft (no date or time)
    if (!event.date || !event.time) return 'draft';
    
    const now = new Date();
    const eventStart = new Date(`${event.date}T${event.time}`);
    
    // Calculate event end time (default to 2.5 hours if no duration)
    let durationHours = 2.5;
    if (event.duration) {
      const durationMatch = event.duration.match(/(\d+(\.\d+)?)/);
      if (durationMatch) {
        durationHours = parseFloat(durationMatch[1]);
      }
    }
    const eventEnd = new Date(eventStart.getTime() + (durationHours * 60 * 60 * 1000));
    
    if (now >= eventStart && now <= eventEnd) return 'live';
    if (now > eventEnd) return 'past';
    if (event.spots_left === 0) return 'full';
    return 'upcoming';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-green-100 text-green-800">Upcoming</Badge>;
      case 'live':
        return <Badge className="bg-green-100 text-green-800">Live</Badge>;
      case 'full':
        return <Badge className="bg-red-100 text-red-800">Full</Badge>;
      case 'past':
        return <Badge className="bg-gray-100 text-gray-800">Past</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
    }
  };

  return (
    <div className="md:hidden space-y-4">
      {events.map((event) => {
        const status = getEventStatus(event);
        const confirmedTickets = event.booking_stats.confirmed_tickets;
        const actualRevenue = event.booking_stats.actual_revenue;
        const isPastEvent = status === 'past';
        const isDraftEvent = status === 'draft';
        const isHighlighted = highlightedEventId === event.id;
        
        return (
          <Card 
            key={event.id}
            className={`${isHighlighted ? 'bg-emerald-50 border-2 border-emerald-300 animate-pulse' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">
                  {event.title}
                  {isHighlighted && (
                    <span className="ml-2 text-emerald-600 font-bold">✨ New</span>
                  )}
                </h3>
                {getStatusBadge(status)}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <p>
                  {event.date 
                    ? `${format(new Date(event.date), 'MMM dd, yyyy')} at ${event.time}`
                    : 'Date not set'
                  }
                </p>
                <p>{confirmedTickets}/{event.capacity} spots | Revenue: €{actualRevenue.toFixed(2)}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {!isDraftEvent && !isPastEvent && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEventAction('edit', event.id)}
                  >
                    Edit
                  </Button>
                )}
                {isDraftEvent && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEventAction('edit', event.id)}
                  >
                    Complete Setup
                  </Button>
                )}
                {!isDraftEvent && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEventAction('attendees', event.id)}
                  >
                    Attendees
                  </Button>
                )}
                {isPastEvent && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEventAction('reviews', event.id)}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Reviews
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {!isDraftEvent && (
                      <DropdownMenuItem onClick={() => onEventAction('view', event.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => onEventAction('duplicate', event.id)}
                      disabled={isDuplicating}
                    >
                      {isDuplicating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onEventAction('delete', event.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
