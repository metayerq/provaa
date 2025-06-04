import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { format } from 'date-fns';

interface CancelBookingDialogProps {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  totalAmount: number;
  onCancel: () => Promise<void>;
  isLoading: boolean;
  trigger?: React.ReactNode;
}

export const CancelBookingDialog: React.FC<CancelBookingDialogProps> = ({
  eventTitle,
  eventDate,
  eventTime,
  totalAmount,
  onCancel,
  isLoading,
  trigger
}) => {
  const [open, setOpen] = useState(false);

  console.log('=== CancelBookingDialog DEBUG ===');
  console.log('Render state:', { open, isLoading });
  console.log('Props:', { eventTitle, eventDate, eventTime, totalAmount });

  const formatEventDateTime = () => {
    try {
      const eventDateTime = new Date(`${eventDate}T${eventTime}`);
      return format(eventDateTime, 'EEEE, MMMM d, yyyy \'at\' h:mm a');
    } catch (error) {
      console.log('Date formatting error:', error);
      return `${eventDate} at ${eventTime}`;
    }
  };

  const truncateEventTitle = (title: string) => {
    // Truncate long titles to keep them readable
    if (title.length > 35) {
      return title.substring(0, 35) + '...';
    }
    return title;
  };

  const handleOpenChange = (isOpen: boolean) => {
    console.log('🔄 Dialog open state changing from', open, 'to', isOpen);
    
    // Don't allow closing during loading
    if (isLoading && !isOpen) {
      console.log('⚠️ Preventing dialog close during loading');
      return;
    }
    
    setOpen(isOpen);
  };

  const handleKeepBooking = () => {
    console.log('🔄 Keep booking clicked');
    setOpen(false);
  };

  const handleCancelBooking = async () => {
    console.log('🚀 Starting cancellation process');
    
    try {
      console.log('📞 Calling onCancel function');
      await onCancel();
      console.log('✅ Cancellation completed successfully');
      
      // Close dialog after successful cancellation
      setOpen(false);
    } catch (error) {
      console.error('❌ Cancellation failed:', error);
      // Keep dialog open on error so user can see error message or try again
    }
  };

  const formattedDateTime = formatEventDateTime();
  const truncatedTitle = truncateEventTitle(eventTitle);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 inline-flex items-center ml-auto"
            disabled={isLoading}
            onClick={() => console.log('🎯 Cancel button clicked')}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <X className="h-4 w-4 mr-1" />
            )}
            Cancel Booking
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-[400px] mx-auto rounded-2xl p-0 overflow-hidden shadow-lg">
        <div className="p-6 md:p-6 px-5 md:px-6">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold text-center leading-tight">
              Cancel Booking?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5">
            {/* Event Details */}
            <div className="text-center space-y-3">
              <p className="text-lg font-bold text-gray-900 leading-snug">{truncatedTitle}</p>
              <p className="text-base text-gray-600 leading-relaxed">{formattedDateTime}</p>
            </div>
            
            {/* Refund Section */}
            <div className="text-center py-4">
              <p className="text-xl font-bold text-gray-900">Refund: €{totalAmount.toFixed(2)}</p>
            </div>
            
            {/* Refund Information */}
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              Your refund will be processed automatically within 5-10 business days.
            </p>
            
            {/* Warning Section */}
            <div className="bg-amber-50 rounded-lg p-3 mx-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-amber-600 text-sm">⚠️</span>
                <p className="text-sm font-medium text-gray-700 leading-relaxed">This action cannot be undone</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3 pt-6 px-6 -mx-6">
            <Button
              onClick={handleKeepBooking}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base"
              disabled={isLoading}
              autoFocus
            >
              Keep Booking
            </Button>
            
            <Button
              onClick={handleCancelBooking}
              variant="outline"
              className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Booking'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
