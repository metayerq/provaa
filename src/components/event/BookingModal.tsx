import React from 'react';
import { SimplifiedBookingModal } from '@/components/booking/SimplifiedBookingModal';

interface BookingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  eventId: string;
  eventTitle: string;
  hostName: string;
  date: string;
  time: string;
  location: string | { address?: string; city?: string; venue?: string; coordinates?: any };
  price: number;
  spotsLeft: number;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onOpenChange,
  isMobile,
  eventId,
  eventTitle,
  hostName,
  date,
  time,
  location,
  price,
  spotsLeft,
  onSuccess
}) => {
  return (
    <SimplifiedBookingModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isMobile={isMobile}
      eventId={eventId}
      eventTitle={eventTitle}
      hostName={hostName}
      date={date}
      time={time}
      location={location}
      price={price}
      spotsLeft={spotsLeft}
      onSuccess={onSuccess}
    />
  );
};
