
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DeleteEventInfoCards } from './DeleteEventInfoCards';
import { AlertTriangle, Users, DollarSign, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DeleteEventStep1Props {
  eventTitle: string;
  eventDate: string;
  attendeeCount: number;
  totalRevenue: number;
  onCancel: () => void;
  onContinue: (reason: string, message: string) => void;
}

export const DeleteEventStep1: React.FC<DeleteEventStep1Props> = ({
  eventTitle,
  eventDate,
  attendeeCount,
  totalRevenue,
  onCancel,
  onContinue
}) => {
  const [deletionReason, setDeletionReason] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  const handleContinue = () => {
    if (!deletionReason.trim()) return;
    onContinue(deletionReason, customMessage);
  };

  return (
    <div className="space-y-6">
      {/* Warning Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Warning:</strong> This action cannot be undone. Deleting this event will:
        </AlertDescription>
      </Alert>

      {/* Consequences List */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">What happens when you delete this event:</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-1">•</span>
            <span>All {attendeeCount} confirmed bookings will be cancelled and marked for refund</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-1">•</span>
            <span>The event will be permanently removed from the platform</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-1">•</span>
            <span>This action will be logged for record keeping</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-1">•</span>
            <span className="text-amber-700">Note: You will need to notify attendees manually (email feature not implemented yet)</span>
          </li>
        </ul>
      </div>

      {/* Event Info Cards */}
      <DeleteEventInfoCards
        eventTitle={eventTitle}
        eventDate={eventDate}
        attendeeCount={attendeeCount}
        totalRevenue={totalRevenue}
      />

      {/* Deletion Reason */}
      <div className="space-y-2">
        <Label htmlFor="deletion-reason">
          Reason for deletion <span className="text-red-500">*</span>
        </Label>
        <Input
          id="deletion-reason"
          placeholder="e.g., Venue unavailable, Host emergency, etc."
          value={deletionReason}
          onChange={(e) => setDeletionReason(e.target.value)}
        />
      </div>

      {/* Custom Message */}
      <div className="space-y-2">
        <Label htmlFor="custom-message">
          Message for attendees (optional - for your records)
        </Label>
        <Textarea
          id="custom-message"
          placeholder="Add a message for your records about what to tell attendees..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          rows={3}
        />
        <p className="text-xs text-gray-500">
          This message will be saved for your records but won't be automatically sent to attendees.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!deletionReason.trim()}
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          Continue to Confirmation
        </Button>
      </div>
    </div>
  );
};
