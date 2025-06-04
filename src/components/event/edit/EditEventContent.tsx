import React from 'react';
import EditingModeForm from '@/components/event/form/EditingModeForm';
import EditEventSidebar from './EditEventSidebar';
import { EventForm } from '@/components/event/form/types';

interface EditEventContentProps {
  event: any;
  eventId: string;
  bookingCount: number;
  formData: EventForm;
  setFormData: React.Dispatch<React.SetStateAction<EventForm>>;
  isSubmitting: boolean;
  savingAsDraft: boolean;
  onFormSubmit: (isDraft?: boolean) => Promise<void>;
  onCapacityChange: (newCapacity: number) => Promise<void>;
  onStatusChange: (status: 'live' | 'paused' | 'cancelled') => Promise<void>;
  isUpdatingCapacity?: boolean;
}

const EditEventContent: React.FC<EditEventContentProps> = ({
  event,
  eventId,
  bookingCount,
  formData,
  setFormData,
  isSubmitting,
  savingAsDraft,
  onFormSubmit,
  onCapacityChange,
  onStatusChange,
  isUpdatingCapacity = false
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <EditingModeForm
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          savingAsDraft={savingAsDraft}
          onSubmit={onFormSubmit}
        />
      </div>

      <div className="lg:col-span-1">
        <EditEventSidebar
          eventId={eventId}
          currentCapacity={event.capacity}
          bookedSpots={bookingCount}
          currentStatus={event.status || 'live'}
          onCapacityChange={onCapacityChange}
          onStatusChange={onStatusChange}
          isUpdatingCapacity={isUpdatingCapacity}
          event={event}
        />
      </div>
    </div>
  );
};

export default EditEventContent;
