
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface StatusChangeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentStatus: 'live' | 'paused' | 'cancelled';
  newStatus: 'live' | 'paused' | 'cancelled';
  hasBookings: boolean;
}

const StatusChangeConfirmationModal: React.FC<StatusChangeConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  newStatus,
  hasBookings
}) => {
  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'live':
        return 'live and accepting bookings';
      case 'paused':
        return 'paused and hidden from search';
      case 'cancelled':
        return 'cancelled with automatic refunds';
      default:
        return status;
    }
  };

  const getWarningMessage = () => {
    if (newStatus === 'cancelled' && hasBookings) {
      return 'This will automatically notify all attendees and initiate refunds for existing bookings.';
    }
    if (newStatus === 'paused' && hasBookings) {
      return 'This will hide the event from search results but existing bookings will remain confirmed.';
    }
    if (newStatus === 'live' && currentStatus !== 'live') {
      return 'This will make the event visible and available for new bookings.';
    }
    return 'This will affect the event visibility and booking availability.';
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Change Event Status?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to change the event status from{' '}
              <span className="font-medium">{currentStatus}</span> to{' '}
              <span className="font-medium">{getStatusDescription(newStatus)}</span>?
            </p>
            <p className="text-sm text-gray-600">
              {getWarningMessage()}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={newStatus === 'cancelled' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Confirm Change
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StatusChangeConfirmationModal;
