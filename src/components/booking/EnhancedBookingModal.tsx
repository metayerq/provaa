
import React from 'react';
import { 
  Dialog, 
  DialogContent,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
} from '@/components/ui/drawer';
import { BookingProvider, useBooking } from '@/contexts/BookingContext';
import { BookingStep1 } from './BookingStep1';
import { BookingStep2 } from './BookingStep2';
import { BookingStep3 } from './BookingStep3';
import { BookingStep4 } from './BookingStep4';
import { BookingStep5 } from './BookingStep5';

interface BookingStepsProps {
  onClose: () => void;
  onPaymentRedirect?: () => void;
}

const BookingSteps: React.FC<BookingStepsProps> = ({ onClose, onPaymentRedirect }) => {
  const { currentStep } = useBooking();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BookingStep1 />;
      case 2:
        return <BookingStep2 />;
      case 3:
        return <BookingStep3 onPaymentRedirect={onPaymentRedirect} />;
      case 4:
        return <BookingStep4 />;
      case 5:
        return <BookingStep5 onClose={onClose} />;
      default:
        return <BookingStep1 />;
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {renderStep()}
    </div>
  );
};

interface EnhancedBookingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  eventId: string;
  eventTitle: string;
  hostName: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  price: number;
  spotsLeft: number;
  onSuccess: () => void;
}

export const EnhancedBookingModal: React.FC<EnhancedBookingModalProps> = ({
  isOpen,
  onOpenChange,
  isMobile,
  eventId,
  eventTitle,
  hostName,
  date,
  time,
  duration,
  location,
  price,
  spotsLeft,
  onSuccess
}) => {
  const serviceFee = Math.round(price * 0.05 * 100) / 100;
  const totalAmount = price + serviceFee;

  const initialData = {
    eventId,
    eventTitle,
    hostName,
    date,
    time,
    duration,
    location,
    price,
    serviceFee,
    totalAmount,
    spotsLeft,
    numberOfTickets: 1
  };

  const handleClose = () => {
    onOpenChange(false);
    onSuccess();
  };

  // Handle payment redirect - close modal before redirect for mobile
  const handlePaymentRedirect = () => {
    console.log('🚀 Payment redirect triggered, closing modal for mobile optimization');
    onOpenChange(false);
  };

  if (isMobile) {
    return (
      <BookingProvider initialData={initialData}>
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[90vh]">
            <div className="px-4 pb-4 pt-2">
              <BookingSteps onClose={handleClose} onPaymentRedirect={handlePaymentRedirect} />
            </div>
          </DrawerContent>
        </Drawer>
      </BookingProvider>
    );
  }
  
  return (
    <BookingProvider initialData={initialData}>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden">
          <BookingSteps onClose={handleClose} onPaymentRedirect={handlePaymentRedirect} />
        </DialogContent>
      </Dialog>
    </BookingProvider>
  );
};
