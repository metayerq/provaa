import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Eye, XCircle, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const AdminEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events', searchTerm, dateFrom, dateTo],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select(`
          id,
          title,
          date,
          time,
          duration,
          capacity,
          spots_left,
          created_at,
          host_id
        `)
        .order('date', { ascending: true });

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      if (dateFrom) {
        query = query.gte('date', dateFrom);
      }

      if (dateTo) {
        query = query.lte('date', dateTo);
      }

      const { data: eventsData, error } = await query;
      
      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      
      if (!eventsData) return [];

      // Fetch host information separately
      const eventsWithHostInfo = await Promise.all(
        eventsData.map(async (event) => {
          // Get host information
          const { data: hostData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', event.host_id)
            .single();

          // Get bookings count
          const { count } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id)
            .eq('status', 'confirmed');
          
          return {
            ...event,
            bookings_count: count || 0,
            host_name: hostData?.full_name || 'Unknown Host'
          };
        })
      );

      return eventsWithHostInfo;
    },
  });

  const getEventStatus = (event: any) => {
    if (!event.date || !event.time) return 'draft';
    
    const now = new Date();
    const eventStart = new Date(`${event.date}T${event.time}`);
    
    // Calculate event end time (assume 2.5 hours if no duration specified)
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
      case 'past':
        return <Badge variant="secondary">Past</Badge>;
      case 'live':
        return <Badge className="bg-red-100 text-red-800">Live</Badge>;
      case 'full':
        return <Badge variant="destructive">Full</Badge>;
      case 'upcoming':
        return <Badge className="bg-green-100 text-green-800">Upcoming</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const exportToCSV = () => {
    if (!events) return;

    const headers = ['Event Title', 'Host', 'Date', 'Time', 'Status', 'Capacity', 'Bookings', 'Revenue'];
    const csvContent = [
      headers.join(','),
      ...events.map(event => [
        `"${event.title}"`,
        `"${event.host_name}"`,
        event.date,
        event.time,
        getEventStatus(event),
        event.capacity,
        event.bookings_count,
        `€${(event.bookings_count * 50).toFixed(2)}` // Placeholder calculation
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `events-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEvents = React.useMemo(() => {
    if (!events || !sortField) return events;

    return [...events].sort((a, b) => {
      let aValue = a[sortField as keyof typeof a];
      let bValue = b[sortField as keyof typeof b];

      if (sortField === 'host_name') {
        aValue = a.host_name || '';
        bValue = b.host_name || '';
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [events, sortField, sortDirection]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600">Manage all events on the platform</p>
        </div>
        <Button onClick={exportToCSV} disabled={!events || events.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events or hosts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              type="date"
              placeholder="From date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <Input
              type="date"
              placeholder="To date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setDateFrom("");
                setDateTo("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events ({events?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading events...</div>
            </div>
          ) : !events || events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('title')}
                    >
                      Event Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('host_name')}
                    >
                      Host {sortField === 'host_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('date')}
                    >
                      Date & Time {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedEvents?.map((event: any) => {
                    const status = getEventStatus(event);
                    
                    return (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          <Link 
                            to={`/events/${event.id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {event.title}
                          </Link>
                        </TableCell>
                        <TableCell>{event.host_name}</TableCell>
                        <TableCell>
                          {format(new Date(event.date), 'MMM dd, yyyy')} at {event.time}
                        </TableCell>
                        <TableCell>{getStatusBadge(status)}</TableCell>
                        <TableCell>
                          {event.bookings_count}/{event.capacity}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/events/${event.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            {(status === 'upcoming' || status === 'full') && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Event</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to cancel "{event.title}"? This action cannot be undone and all attendees will be notified.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                      Cancel Event
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEvents;
