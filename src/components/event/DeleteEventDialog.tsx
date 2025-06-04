
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DeleteEventStep1 } from './DeleteEventStep1';
import { DeleteEventStep2 } from './DeleteEventStep2';

interface DeleteEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  attendeeCount: number;
  totalRevenue: number;
  onDeleteSuccess: () => void;
}

export const DeleteEventDialog: React.FC<DeleteEventDialogProps> = ({
  isOpen,
  onOpenChange,
  eventId,
  eventTitle,
  eventDate,
  attendeeCount,
  totalRevenue,
  onDeleteSuccess
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [deletionReason, setDeletionReason] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  const handleClose = () => {
    setCurrentStep(1);
    setDeletionReason('');
    setCustomMessage('');
    onOpenChange(false);
  };

  const handleStep1Continue = (reason: string, message: string) => {
    setDeletionReason(reason);
    setCustomMessage(message);
    setCurrentStep(2);
  };

  const handleDeleteSuccess = () => {
    handleClose();
    onDeleteSuccess();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {currentStep === 1 ? 'Delete Event' : 'Confirm Event Deletion'}
          </AlertDialogTitle>
        </AlertDialogHeader>

        {currentStep === 1 ? (
          <DeleteEventStep1
            eventTitle={eventTitle}
            eventDate={eventDate}
            attendeeCount={attendeeCount}
            totalRevenue={totalRevenue}
            onCancel={handleClose}
            onContinue={handleStep1Continue}
          />
        ) : (
          <DeleteEventStep2
            eventId={eventId}
            eventTitle={eventTitle}
            eventDate={eventDate}
            attendeeCount={attendeeCount}
            totalRevenue={totalRevenue}
            deletionReason={deletionReason}
            customMessage={customMessage}
            onBack={() => setCurrentStep(1)}
            onCancel={handleClose}
            onDeleteSuccess={handleDeleteSuccess}
          />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
