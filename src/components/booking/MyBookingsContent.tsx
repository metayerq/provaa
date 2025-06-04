import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingCard } from './BookingCard';
import { EmptyState } from './EmptyState';
import type { Booking } from '@/types/booking';

interface MyBookingsContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  filterBookings: (status: 'upcoming' | 'past' | 'cancelled') => Booking[];
  onCancel: (bookingId: string) => Promise<void>;
  onAddToCalendar: (booking: Booking) => void;
  canCancelBooking: (booking: Booking) => boolean;
  cancellingBookingId: string | null;
  getTimeUntilCancellationDeadline?: (booking: Booking) => string | null;
  hasReview?: (bookingId: string) => boolean;
  onRateExperience?: (booking: Booking) => void;
}

export const MyBookingsContent: React.FC<MyBookingsContentProps> = ({
  activeTab,
  onTabChange,
  filterBookings,
  onCancel,
  onAddToCalendar,
  canCancelBooking,
  cancellingBookingId,
  getTimeUntilCancellationDeadline,
  hasReview,
  onRateExperience
}) => {
  const upcomingBookings = filterBookings('upcoming');
  const pastBookings = filterBookings('past');
  const cancelledBookings = filterBookings('cancelled');

  const renderBookingsList = (bookings: Booking[], emptyStateType: 'upcoming' | 'past' | 'cancelled') => {
    if (bookings.length === 0) {
      return <EmptyState type={emptyStateType} />;
    }

    return (
      <div className="space-y-6">
        {bookings.map(booking => (
          <BookingCard 
            key={booking.id} 
            booking={booking}
            activeTab={activeTab}
            onCancel={onCancel}
            onAddToCalendar={onAddToCalendar}
            canCancel={canCancelBooking(booking)}
            isCancelling={cancellingBookingId === booking.id}
            getTimeUntilCancellationDeadline={getTimeUntilCancellationDeadline}
            hasReview={hasReview ? hasReview(booking.id) : false}
            onRateExperience={onRateExperience}
          />
        ))}
      </div>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upcoming">
          Upcoming ({upcomingBookings.length})
        </TabsTrigger>
        <TabsTrigger value="past">
          Past ({pastBookings.length})
        </TabsTrigger>
        <TabsTrigger value="cancelled">
          Cancelled ({cancelledBookings.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        {renderBookingsList(upcomingBookings, 'upcoming')}
      </TabsContent>

      <TabsContent value="past">
        {renderBookingsList(pastBookings, 'past')}
      </TabsContent>

      <TabsContent value="cancelled">
        {renderBookingsList(cancelledBookings, 'cancelled')}
      </TabsContent>
    </Tabs>
  );
};
