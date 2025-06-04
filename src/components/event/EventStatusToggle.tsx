
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, CheckCircle, PauseCircle, XCircle } from 'lucide-react';
import StatusChangeConfirmationModal from '@/components/event/edit/StatusChangeConfirmationModal';

interface EventStatusToggleProps {
  currentStatus: 'live' | 'paused' | 'cancelled';
  hasBookings: boolean;
  onStatusChange: (status: 'live' | 'paused' | 'cancelled') => void;
}

const EventStatusToggle: React.FC<EventStatusToggleProps> = ({
  currentStatus,
  hasBookings,
  onStatusChange
}) => {
  const [pendingStatus, setPendingStatus] = useState<'live' | 'paused' | 'cancelled' | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'paused':
        return <PauseCircle className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'live':
        return 'Event is visible and accepting bookings';
      case 'paused':
        return 'Event is temporarily hidden from search results';
      case 'cancelled':
        return 'Event is cancelled and attendees will be notified';
      default:
        return '';
    }
  };

  const handleStatusClick = (newStatus: 'live' | 'paused' | 'cancelled') => {
    if (newStatus === currentStatus) return;
    
    setPendingStatus(newStatus);
    setShowConfirmation(true);
  };

  const handleConfirmStatusChange = () => {
    if (pendingStatus) {
      onStatusChange(pendingStatus);
    }
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  const handleCancelStatusChange = () => {
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  return (
    <>
      <div className="space-y-4">
        <Label className="text-base font-medium">Event Status</Label>
        
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <RadioGroup
            value={currentStatus}
            onValueChange={handleStatusClick}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="live" id="live" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon('live')}
                  <Label htmlFor="live" className="font-medium cursor-pointer">Live</Label>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {getStatusDescription('live')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="paused" id="paused" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon('paused')}
                  <Label htmlFor="paused" className="font-medium cursor-pointer">Paused</Label>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {getStatusDescription('paused')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="cancelled" id="cancelled" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon('cancelled')}
                  <Label htmlFor="cancelled" className="font-medium cursor-pointer">Cancelled</Label>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {getStatusDescription('cancelled')}
                </p>
              </div>
            </div>
          </RadioGroup>

          {hasBookings && currentStatus === 'live' && (
            <Alert className="mt-4 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                This event has active bookings. Status changes will affect existing attendees.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <StatusChangeConfirmationModal
        isOpen={showConfirmation}
        onClose={handleCancelStatusChange}
        onConfirm={handleConfirmStatusChange}
        currentStatus={currentStatus}
        newStatus={pendingStatus || 'live'}
        hasBookings={hasBookings}
      />
    </>
  );
};

export default EventStatusToggle;
