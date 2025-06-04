import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DeleteEventDialog } from '@/components/event/DeleteEventDialog';
import { HostStatsCards } from '@/components/host/HostStatsCards';
import { HostEventsHeader } from '@/components/host/HostEventsHeader';
import { HostEventsSearch } from '@/components/host/HostEventsSearch';
import { HostEventsTable } from '@/components/host/HostEventsTable';
import { HostEventsMobileView } from '@/components/host/HostEventsMobileView';
import { HostEventsEmptyState } from '@/components/host/HostEventsEmptyState';
import { HostReviewsModal } from '@/components/host/HostReviewsModal';
import { useHostEvents, Event } from '@/hooks/useHostEvents';
import { useHostStats } from '@/hooks/useHostStats';
import { useHostReviews } from '@/hooks/useHostReviews';
import { useEventDuplication } from '@/hooks/useEventDuplication';

interface HostEventsContentProps {}

export const HostEventsContent: React.FC<HostEventsContentProps> = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { events, loading, refetchEvents } = useHostEvents();
  const { stats, refetchStats } = useHostStats(events);
  const { reviews: allReviews, loading: reviewsLoading, refetchReviews } = useHostReviews();
  const { duplicateEvent, isDuplicating } = useEventDuplication();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [newDuplicatedEventId, setNewDuplicatedEventId] = useState<string | null>(null);
  const [showDraftsHighlight, setShowDraftsHighlight] = useState(false);
  
  const [reviewsModal, setReviewsModal] = useState<{
    isOpen: boolean;
    eventId?: string;
    eventTitle?: string;
  }>({
    isOpen: false
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    eventId: string;
    eventTitle: string;
    eventDate: string;
    attendeeCount: number;
    totalRevenue: number;
  }>({
    isOpen: false,
    eventId: '',
    eventTitle: '',
    eventDate: '',
    attendeeCount: 0,
    totalRevenue: 0
  });

  // Check for hash navigation to drafts tab
  useEffect(() => {
    if (window.location.hash === '#drafts') {
      setActiveTab('drafts');
      setShowDraftsHighlight(true);
      // Clear hash
      window.history.replaceState(null, '', window.location.pathname);
      // Remove highlight after 10 seconds
      setTimeout(() => setShowDraftsHighlight(false), 10000);
    }
  }, []);

  // Combine stats with review count
  const statsWithReviews = {
    ...stats,
    reviewCount: allReviews.length
  };

  const getEventEndTime = (event: Event) => {
    if (!event.date || !event.time) return null;
    
    const eventStart = new Date(`${event.date}T${event.time}`);
    
    // Calculate duration in hours (default to 2.5 hours if no duration)
    let durationHours = 2.5;
    if (event.duration) {
      const durationMatch = event.duration.match(/(\d+(\.\d+)?)/);
      if (durationMatch) {
        durationHours = parseFloat(durationMatch[1]);
      }
    }
    
    return new Date(eventStart.getTime() + (durationHours * 60 * 60 * 1000));
  };

  const filterEvents = (events: Event[], tab: string) => {
    const now = new Date();
    
    switch (tab) {
      case 'upcoming':
        return events.filter(e => {
          if (!e.date || !e.time) return false;
          const eventStart = new Date(`${e.date}T${e.time}`);
          return eventStart > now;
        });
      case 'past':
        return events.filter(e => {
          if (!e.date || !e.time) return false;
          const eventEnd = getEventEndTime(e);
          return eventEnd && eventEnd <= now;
        });
      case 'drafts':
        return events.filter(e => !e.date || !e.time);
      default:
        return events;
    }
  };

  const filteredEvents = filterEvents(events, activeTab).filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const draftEvents = filterEvents(events, 'drafts');

  const handleEventAction = async (action: string, eventId: string) => {
    switch (action) {
      case 'view':
        navigate(`/events/${eventId}`);
        break;
      case 'edit':
        navigate(`/host/events/${eventId}/edit`);
        break;
      case 'attendees':
        navigate(`/host/events/${eventId}/attendees`);
        break;
      case 'duplicate':
        await handleDuplicate(eventId);
        break;
      case 'reviews':
        const event = events.find(e => e.id === eventId);
        setReviewsModal({
          isOpen: true,
          eventId,
          eventTitle: event?.title
        });
        break;
      case 'delete':
        await handleDeleteClick(eventId);
        break;
    }
  };

  const handleDuplicate = async (eventId: string) => {
    const originalEvent = events.find(e => e.id === eventId);
    if (!originalEvent) return;

    const newEvent = await duplicateEvent(originalEvent, () => {
      refetchEvents();
      setShowDraftsHighlight(true);
      // Remove highlight after 10 seconds
      setTimeout(() => setShowDraftsHighlight(false), 10000);
    });

    if (newEvent) {
      setNewDuplicatedEventId(newEvent.id);
      // Clear highlighted event after user interacts
      setTimeout(() => setNewDuplicatedEventId(null), 15000);
    }
  };

  const handleViewAllReviews = () => {
    setReviewsModal({
      isOpen: true
    });
  };

  const handleDeleteClick = async (eventId: string) => {
    try {
      // Get event details and booking count
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      const { count: bookingCount, error: bookingError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'confirmed');

      if (bookingError) throw bookingError;

      // Get actual revenue from confirmed bookings
      const { data: bookings, error: revenueError } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('event_id', eventId)
        .eq('status', 'confirmed');

      if (revenueError) throw revenueError;

      const totalRevenue = bookings?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;

      setDeleteDialog({
        isOpen: true,
        eventId,
        eventTitle: event.title,
        eventDate: event.date,
        attendeeCount: bookingCount || 0,
        totalRevenue
      });
    } catch (error: any) {
      console.error('Error preparing delete dialog:', error);
      toast({
        title: "Error",
        description: "Failed to load event details for deletion",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSuccess = () => {
    refetchEvents();
    refetchStats();
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <HostEventsHeader onCreateEvent={handleCreateEvent} />
      <HostStatsCards 
        stats={statsWithReviews} 
        onViewAllReviews={handleViewAllReviews}
      />
      <HostEventsSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="upcoming">
            Upcoming ({filterEvents(events, 'upcoming').length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({filterEvents(events, 'past').length})
          </TabsTrigger>
          <TabsTrigger 
            value="drafts" 
            className={`relative ${showDraftsHighlight ? 'bg-emerald-50 border-emerald-300 animate-pulse' : ''}`}
          >
            <span>Drafts ({draftEvents.length})</span>
            {showDraftsHighlight && (
              <span className="ml-1 text-emerald-600 font-bold">✨ New</span>
            )}
            {showDraftsHighlight && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({events.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredEvents.length === 0 ? (
            <HostEventsEmptyState 
              activeTab={activeTab} 
              onCreateEvent={handleCreateEvent} 
            />
          ) : (
            <>
              <HostEventsTable 
                events={filteredEvents} 
                onEventAction={handleEventAction}
                highlightedEventId={newDuplicatedEventId}
                isDuplicating={isDuplicating}
              />
              <HostEventsMobileView 
                events={filteredEvents} 
                onEventAction={handleEventAction}
                highlightedEventId={newDuplicatedEventId}
                isDuplicating={isDuplicating}
              />
            </>
          )}
        </TabsContent>
      </Tabs>

      <DeleteEventDialog
        isOpen={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, isOpen: open }))}
        eventId={deleteDialog.eventId}
        eventTitle={deleteDialog.eventTitle}
        eventDate={deleteDialog.eventDate}
        attendeeCount={deleteDialog.attendeeCount}
        totalRevenue={deleteDialog.totalRevenue}
        onDeleteSuccess={handleDeleteSuccess}
      />

      <HostReviewsModal
        isOpen={reviewsModal.isOpen}
        onOpenChange={(open) => setReviewsModal(prev => ({ ...prev, isOpen: open }))}
        reviews={reviewsModal.eventId 
          ? allReviews.filter(review => review.event.id === reviewsModal.eventId)
          : allReviews
        }
        eventTitle={reviewsModal.eventTitle}
        loading={reviewsLoading}
      />
    </div>
  );
};
