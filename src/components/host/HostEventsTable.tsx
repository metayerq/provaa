
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  UserCheck,
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

interface HostEventsTableProps {
  events: Event[];
  onEventAction: (action: string, eventId: string) => void;
  highlightedEventId?: string | null;
  isDuplicating?: boolean;
}

export const HostEventsTable: React.FC<HostEventsTableProps> = ({
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
    <div className="hidden md:block">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Spots</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                const status = getEventStatus(event);
                const confirmedTickets = event.booking_stats.confirmed_tickets;
                const actualRevenue = event.booking_stats.actual_revenue;
                const isPastEvent = status === 'past';
                const isDraftEvent = status === 'draft';
                const isHighlighted = highlightedEventId === event.id;
                
                return (
                  <TableRow 
                    key={event.id}
                    className={`${isHighlighted ? 'bg-emerald-50 border-2 border-emerald-300 animate-pulse' : ''}`}
                  >
                    <TableCell>
                      {getStatusBadge(status)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {event.title}
                      {isHighlighted && (
                        <span className="ml-2 text-emerald-600 font-bold">✨ New</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {event.date ? format(new Date(event.date), 'MMM dd') : 'Not set'}
                    </TableCell>
                    <TableCell>
                      {confirmedTickets}/{event.capacity}
                    </TableCell>
                    <TableCell>
                      €{actualRevenue.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!isDraftEvent && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEventAction('view', event.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {(!isPastEvent || isDraftEvent) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEventAction('edit', event.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {!isDraftEvent && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEventAction('attendees', event.id)}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                        {isPastEvent && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEventAction('reviews', event.id)}
                            title="View Reviews"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
