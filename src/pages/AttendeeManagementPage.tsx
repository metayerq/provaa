import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AttendeePageHeader } from '@/components/attendees/AttendeePageHeader';
import { AttendeeStatsCards } from '@/components/attendees/AttendeeStatsCards';
import { AttendeeTable } from '@/components/attendees/AttendeeTable';
import { AttendeeSearch } from '@/components/attendees/AttendeeSearch';
import { PendingBookingsPanel } from '@/components/attendees/PendingBookingsPanel';
import { DataConsistencyButton } from '@/components/attendees/DataConsistencyButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

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

interface AttendeeData {
  id: string;
  booking_reference: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  number_of_tickets: number;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  dietary_restrictions?: string;
  special_requests?: string;
  event_id: string; // Added missing event_id property
}

interface AttendeeStats {
  totalAttendees: number;
  totalRevenue: number;
  capacityUtilization: number;
  averageTicketsPerBooking: number;
  cancellationRate: number;
}

const AttendeeManagementPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventData | null>(null);
  const [allBookings, setAllBookings] = useState<AttendeeData[]>([]);
  const [confirmedAttendees, setConfirmedAttendees] = useState<AttendeeData[]>([]);
  const [pendingBookings, setPendingBookings] = useState<AttendeeData[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<AttendeeData[]>([]);
  const [stats, setStats] = useState<AttendeeStats>({
    totalAttendees: 0,
    totalRevenue: 0,
    capacityUtilization: 0,
    averageTicketsPerBooking: 0,
    cancellationRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dataInconsistency, setDataInconsistency] = useState<string | null>(null);

  useEffect(() => {
    console.log('AttendeeManagementPage useEffect triggered');
    console.log('eventId:', eventId);
    console.log('user:', user);
    
    if (eventId && user) {
      console.log('Both eventId and user available, fetching data...');
      fetchEventAndAttendees();
    } else {
      console.log('Missing eventId or user:', { eventId, user: !!user });
      setLoading(false);
    }
  }, [eventId, user]);

  useEffect(() => {
    filterAttendees();
  }, [confirmedAttendees, searchTerm, statusFilter]);

  const validateEventData = (eventData: EventData, confirmedBookings: AttendeeData[]) => {
    const totalConfirmedTickets = confirmedBookings.reduce((sum, booking) => sum + booking.number_of_tickets, 0);
    const expectedSpotsLeft = eventData.capacity - totalConfirmedTickets;
    
    console.log('Data validation:', {
      capacity: eventData.capacity,
      spotsLeft: eventData.spots_left,
      totalConfirmedTickets,
      expectedSpotsLeft
    });

    // Check for data inconsistencies
    if (eventData.spots_left !== expectedSpotsLeft) {
      const message = `Data inconsistency detected: Expected ${expectedSpotsLeft} spots left but found ${eventData.spots_left}. Capacity: ${eventData.capacity}, Confirmed tickets: ${totalConfirmedTickets}`;
      setDataInconsistency(message);
      console.warn(message);
      
      // Automatically correct the data in our local state
      setEvent(prev => prev ? { ...prev, spots_left: expectedSpotsLeft } : null);
      
      return false;
    }

    // Check for impossible values
    if (eventData.spots_left < 0) {
      const message = `Invalid data: Negative spots left (${eventData.spots_left})`;
      setDataInconsistency(message);
      console.warn(message);
      return false;
    }

    if (eventData.spots_left > eventData.capacity) {
      const message = `Invalid data: Spots left (${eventData.spots_left}) exceeds capacity (${eventData.capacity})`;
      setDataInconsistency(message);
      console.warn(message);
      return false;
    }

    setDataInconsistency(null);
    return true;
  };

  const fetchEventAndAttendees = async () => {
    try {
      console.log('Starting fetchEventAndAttendees...');
      setLoading(true);

      // Fetch event details
      console.log('Fetching event data for eventId:', eventId, 'and host_id:', user?.id);
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('host_id', user?.id)
        .single();

      console.log('Event query result:', { eventData, eventError });

      if (eventError) {
        console.error('Event fetch error:', eventError);
        throw eventError;
      }

      // Fetch all bookings with enhanced logging
      console.log('Fetching bookings for eventId:', eventId);
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      console.log('Bookings query result:', { bookingsData, bookingsError });

      if (bookingsError) {
        console.error('Bookings fetch error:', bookingsError);
        throw bookingsError;
      }

      console.log('Setting event and attendees data...');
      const allBookingsData = bookingsData || [];
      
      // Enhanced filtering with better logging
      const confirmedBookingsData = allBookingsData.filter(b => {
        const isConfirmed = b.status === 'confirmed';
        console.log(`Booking ${b.booking_reference}: status=${b.status}, isConfirmed=${isConfirmed}`);
        return isConfirmed;
      });
      
      const pendingBookingsData = allBookingsData.filter(b => {
        const isPending = b.status === 'pending';
        console.log(`Booking ${b.booking_reference}: status=${b.status}, isPending=${isPending}`);
        return isPending;
      });
      
      console.log(`Filtered results:`, {
        total: allBookingsData.length,
        confirmed: confirmedBookingsData.length,
        pending: pendingBookingsData.length,
        cancelled: allBookingsData.filter(b => b.status === 'cancelled').length
      });
      
      // Validate data consistency with confirmed bookings only
      validateEventData(eventData, confirmedBookingsData);
      
      setEvent(eventData);
      setAllBookings(allBookingsData);
      setConfirmedAttendees(confirmedBookingsData);
      setPendingBookings(pendingBookingsData);
      calculateStats(confirmedBookingsData, eventData);
      
      console.log('Data fetch completed successfully');
      console.log('Confirmed bookings:', confirmedBookingsData.length);
      console.log('Pending bookings:', pendingBookingsData.length);
    } catch (error: any) {
      console.error('Error in fetchEventAndAttendees:', error);
      toast({
        title: "Error Loading Data",
        description: error.message || "Failed to load attendee data",
        variant: "destructive"
      });
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const calculateStats = (confirmedBookings: AttendeeData[], eventData: EventData) => {
    console.log('Calculating stats for confirmed bookings:', confirmedBookings.length, 'eventData:', eventData);
    
    const cancelledBookings = allBookings.filter(b => b.status === 'cancelled');
    
    const totalAttendees = confirmedBookings.reduce((sum, booking) => sum + booking.number_of_tickets, 0);
    const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + Number(booking.total_amount), 0);
    
    // Use validated capacity calculation
    const actualSpotsLeft = Math.max(0, eventData.capacity - totalAttendees);
    const capacityUtilization = eventData.capacity > 0 ? (totalAttendees / eventData.capacity) * 100 : 0;
    const averageTicketsPerBooking = confirmedBookings.length > 0 ? totalAttendees / confirmedBookings.length : 0;
    const cancellationRate = allBookings.length > 0 ? (cancelledBookings.length / allBookings.length) * 100 : 0;

    const calculatedStats = {
      totalAttendees,
      totalRevenue,
      capacityUtilization: Math.min(100, capacityUtilization),
      averageTicketsPerBooking,
      cancellationRate
    };

    console.log('Calculated stats:', calculatedStats);
    setStats(calculatedStats);
  };

  const filterAttendees = () => {
    let filtered = confirmedAttendees;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(attendee =>
        attendee.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.guest_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.booking_reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Note: Status filter removed since we only show confirmed attendees in main view
    setFilteredAttendees(filtered);
  };

  const handleBookingUpdate = () => {
    // Enhanced refresh with better logging
    console.log('Booking updated, refreshing data...');
    console.log('Current pending bookings before refresh:', pendingBookings.length);
    fetchEventAndAttendees();
  };

  const handleDataConsistencyFix = () => {
    console.log('Data consistency fix completed, refreshing data...');
    fetchEventAndAttendees();
  };

  const handleBackClick = () => {
    navigate('/host/events');
  };

  console.log('Render state:', { loading, event: !!event, user: !!user, eventId });

  if (loading) {
    return (
      <ProtectedRoute requiredUserType="host">
        <Layout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading attendee data...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!user) {
    console.log('No user found, should redirect to login');
    return (
      <ProtectedRoute requiredUserType="host">
        <Layout>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
              <p className="text-gray-600 mb-6">Please log in to access this page.</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!eventId) {
    console.log('No eventId found in URL');
    return (
      <ProtectedRoute requiredUserType="host">
        <Layout>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Event</h1>
              <p className="text-gray-600 mb-6">No event ID provided in the URL.</p>
              <button
                onClick={handleBackClick}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded"
              >
                Back to My Events
              </button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute requiredUserType="host">
        <Layout>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
              <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or you don't have permission to view it.</p>
              <button
                onClick={handleBackClick}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded"
              >
                Back to My Events
              </button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredUserType="host">
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <AttendeePageHeader event={event} onBackClick={handleBackClick} />
          
          {dataInconsistency && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Data Inconsistency Detected:</strong> {dataInconsistency}
                    <br />
                    <span className="text-sm">Click the button to automatically fix the spots calculation.</span>
                  </div>
                  <DataConsistencyButton onFixComplete={handleDataConsistencyFix} />
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <AttendeeStatsCards stats={stats} />
          
          <div className="mb-6">
            <AttendeeSearch 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter="confirmed"
              onStatusFilterChange={() => {}}
              hideStatusFilter={true}
            />
          </div>

          <Tabs defaultValue="attendees" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="attendees">
                Confirmed ({filteredAttendees.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="attendees" className="mt-6">
              <AttendeeTable 
                attendees={filteredAttendees} 
                onBookingUpdate={handleBookingUpdate}
              />
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <PendingBookingsPanel 
                pendingBookings={pendingBookings}
                onBookingUpdate={handleBookingUpdate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AttendeeManagementPage;
