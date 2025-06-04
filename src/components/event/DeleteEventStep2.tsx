
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DeleteEventStep2Props {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  attendeeCount: number;
  totalRevenue: number;
  deletionReason: string;
  customMessage: string;
  onBack: () => void;
  onCancel: () => void;
  onDeleteSuccess: () => void;
}

export const DeleteEventStep2: React.FC<DeleteEventStep2Props> = ({
  eventId,
  eventTitle,
  eventDate,
  attendeeCount,
  totalRevenue,
  deletionReason,
  customMessage,
  onBack,
  onCancel,
  onDeleteSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmations, setConfirmations] = useState({
    understand: false,
    attendeesNotified: false,
    refundsProcessed: false,
    cannotUndo: false
  });
  const { toast } = useToast();

  const allConfirmed = Object.values(confirmations).every(Boolean);

  const handleCheckboxChange = (key: keyof typeof confirmations) => {
    setConfirmations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDelete = async () => {
    if (!allConfirmed) return;

    setIsLoading(true);
    try {
      console.log('Starting frontend event deletion process for event:', eventId);

      // Step 1: Cancel all confirmed bookings for this event
      const { error: bookingsError } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('event_id', eventId)
        .eq('status', 'confirmed');

      if (bookingsError) {
        console.error('Error updating bookings:', bookingsError);
        throw new Error('Failed to cancel bookings: ' + bookingsError.message);
      }

      console.log('Bookings cancelled successfully');

      // Step 2: Log the deletion in event_deletions table
      const { error: logError } = await supabase
        .from('event_deletions')
        .insert({
          event_id: eventId,
          event_title: eventTitle,
          host_id: (await supabase.auth.getUser()).data.user?.id,
          deletion_reason: deletionReason,
          custom_message: customMessage || null,
          attendee_count: attendeeCount,
          total_refund_amount: totalRevenue
        });

      if (logError) {
        console.error('Error logging deletion:', logError);
        // Continue with deletion even if logging fails
      }

      console.log('Deletion logged successfully');

      // Step 3: Delete all cancelled bookings for this event to avoid foreign key constraint
      const { error: deleteBookingsError } = await supabase
        .from('bookings')
        .delete()
        .eq('event_id', eventId);

      if (deleteBookingsError) {
        console.error('Error deleting bookings:', deleteBookingsError);
        throw new Error('Failed to delete booking records: ' + deleteBookingsError.message);
      }

      console.log('Booking records deleted successfully');

      // Step 4: Finally, delete the event
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (deleteError) {
        console.error('Error deleting event:', deleteError);
        throw new Error('Failed to delete event: ' + deleteError.message);
      }

      console.log('Event deletion completed successfully');

      toast({
        title: "Event Deleted Successfully",
        description: `"${eventTitle}" has been permanently deleted. Attendee notifications need to be handled manually.`,
      });

      onDeleteSuccess();
    } catch (error: any) {
      console.error('Error in event deletion:', error);
      toast({
        title: "Error Deleting Event",
        description: error.message || "Failed to delete the event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Final Summary */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You are about to permanently delete "<strong>{eventTitle}</strong>" scheduled for{' '}
          <strong>{new Date(eventDate).toLocaleDateString()}</strong>.
        </AlertDescription>
      </Alert>

      {/* Actions Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-3">Final confirmation - These actions will be taken:</h4>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>All {attendeeCount} bookings will be cancelled and permanently removed (${totalRevenue} refund eligible)</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>The event will be permanently removed from the platform</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Deletion will be logged with reason: "{deletionReason}"</span>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-amber-800">Note: You will need to notify attendees manually about the cancellation</span>
          </div>
        </div>
      </div>

      {/* Confirmations */}
      <div className="space-y-4">
        <h4 className="font-medium">Please confirm you understand:</h4>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="understand"
              checked={confirmations.understand}
              onCheckedChange={() => handleCheckboxChange('understand')}
            />
            <label htmlFor="understand" className="text-sm leading-5">
              I understand that this action is permanent and cannot be undone
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="attendeesNotified"
              checked={confirmations.attendeesNotified}
              onCheckedChange={() => handleCheckboxChange('attendeesNotified')}
            />
            <label htmlFor="attendeesNotified" className="text-sm leading-5">
              I understand that {attendeeCount} attendees will need to be notified manually about this cancellation
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="refundsProcessed"
              checked={confirmations.refundsProcessed}
              onCheckedChange={() => handleCheckboxChange('refundsProcessed')}
            />
            <label htmlFor="refundsProcessed" className="text-sm leading-5">
              I understand that all attendees are eligible for full refunds (${totalRevenue} total)
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="cannotUndo"
              checked={confirmations.cannotUndo}
              onCheckedChange={() => handleCheckboxChange('cannotUndo')}
            />
            <label htmlFor="cannotUndo" className="text-sm leading-5">
              I accept full responsibility for this deletion and its consequences
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          disabled={!allConfirmed || isLoading}
          className="bg-red-600 hover:bg-red-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Deleting Event...
            </>
          ) : (
            'Delete Event Permanently'
          )}
        </Button>
      </div>
    </div>
  );
};
