
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { X, Clock, Phone } from 'lucide-react';
import { format } from 'date-fns';

interface CannotCancelDialogProps {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  trigger?: React.ReactNode;
}

export const CannotCancelDialog: React.FC<CannotCancelDialogProps> = ({
  eventTitle,
  eventDate,
  eventTime,
  trigger
}) => {
  const formatEventDateTime = () => {
    try {
      const eventDateTime = new Date(`${eventDate}T${eventTime}`);
      return format(eventDateTime, 'EEEE, MMMM d, yyyy \'at\' h:mm a');
    } catch (error) {
      return `${eventDate} at ${eventTime}`;
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            size="sm"
            className="text-gray-400 border-gray-200 cursor-not-allowed opacity-50 inline-flex items-center ml-auto"
            disabled
          >
            <X className="h-4 w-4 mr-1" />
            Cancel Booking
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            Cannot Cancel Booking
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 text-left">
            <p>
              Unfortunately, you cannot cancel your booking for <strong>"{eventTitle}"</strong> 
              scheduled for {formatEventDateTime()}.
            </p>
            
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Cancellation Policy:</strong> Bookings can only be cancelled up to 48 hours before the event starts.
              </p>
            </div>
            
            <p className="text-sm">
              We understand that sometimes plans change. If you have special circumstances, please contact our support team who may be able to help.
            </p>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>Need help? Contact support</span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-emerald-600 hover:bg-emerald-700">
            I Understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
