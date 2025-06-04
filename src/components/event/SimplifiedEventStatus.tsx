import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Trash2 } from 'lucide-react';
import { DeleteEventDialog } from '@/components/event/DeleteEventDialog';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SimplifiedEventStatusProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  bookedSpots: number;
}

const SimplifiedEventStatus: React.FC<SimplifiedEventStatusProps> = ({
  eventId,
  eventTitle,
  eventDate,
  bookedSpots
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const navigate = useNavigate();

  // Fetch actual revenue from bookings
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('total_amount')
          .eq('event_id', eventId)
          .eq('status', 'confirmed');

        if (error) throw error;

        const revenue = bookings?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;
        setTotalRevenue(revenue);
      } catch (error) {
        console.error('Error fetching revenue:', error);
        setTotalRevenue(0);
      }
    };

    if (eventId) {
      fetchRevenue();
    }
  }, [eventId]);

  const handleDeleteSuccess = () => {
    navigate('/host/events');
  };

  return (
    <>
      <div className="space-y-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            {/* Left side: Live status indicator */}
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">Live</div>
                <div className="text-sm text-gray-600">Event is visible and accepting bookings</div>
              </div>
            </div>

            {/* Right side: Delete button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Event
            </Button>
          </div>
        </div>
      </div>

      <DeleteEventDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        eventId={eventId}
        eventTitle={eventTitle}
        eventDate={eventDate}
        attendeeCount={bookedSpots}
        totalRevenue={totalRevenue}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </>
  );
};

export default SimplifiedEventStatus; 