import React, { useState, useEffect } from 'react';
import CapacityManager from '@/components/event/CapacityManager';
import SimplifiedEventStatus from '@/components/event/SimplifiedEventStatus';
import { supabase } from '@/integrations/supabase/client';

interface EditEventSidebarProps {
  eventId: string;
  currentCapacity: number;
  bookedSpots: number;
  currentStatus: 'live' | 'paused' | 'cancelled';
  onCapacityChange: (newCapacity: number) => Promise<void>;
  onStatusChange: (status: 'live' | 'paused' | 'cancelled') => void;
  isUpdatingCapacity?: boolean;
  event?: any; // Add event prop to get title and date
}

const EditEventSidebar: React.FC<EditEventSidebarProps> = ({
  eventId,
  currentCapacity,
  bookedSpots,
  currentStatus,
  onCapacityChange,
  onStatusChange,
  isUpdatingCapacity = false,
  event
}) => {
  return (
    <div className="space-y-6">
      <CapacityManager
        currentCapacity={currentCapacity}
        bookedSpots={bookedSpots}
        onCapacityChange={onCapacityChange}
        eventId={eventId}
        isUpdating={isUpdatingCapacity}
      />

      <SimplifiedEventStatus
        eventId={eventId}
        eventTitle={event?.title || ''}
        eventDate={event?.date || ''}
        bookedSpots={bookedSpots}
      />
    </div>
  );
};

export default EditEventSidebar;
