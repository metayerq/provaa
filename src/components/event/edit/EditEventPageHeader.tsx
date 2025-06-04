
import React from 'react';
import EditEventHeader from './EditEventHeader';
import EditEventWarningBanner from './EditEventWarningBanner';
import { EventForm } from '@/components/event/form/types';

interface EditEventPageHeaderProps {
  event: any;
  bookingCount: number;
  isSaving: boolean;
  savingAsDraft: boolean;
  formData: EventForm;
  onSave: () => void;
  onSaveAsDraft: () => void;
  onPublish: () => void;
  onCancel: () => void;
}

const EditEventPageHeader: React.FC<EditEventPageHeaderProps> = ({
  event,
  bookingCount,
  isSaving,
  savingAsDraft,
  formData,
  onSave,
  onSaveAsDraft,
  onPublish,
  onCancel
}) => {
  return (
    <>
      <EditEventHeader
        eventTitle={event.title}
        eventDate={event.date}
        bookingCount={bookingCount}
        eventCapacity={event.capacity}
        eventStatus={event.status || 'live'}
        isSaving={isSaving}
        savingAsDraft={savingAsDraft}
        formData={formData}
        existingImageUrl={event.image}
        onSave={onSave}
        onSaveAsDraft={onSaveAsDraft}
        onPublish={onPublish}
        onCancel={onCancel}
      />
      <EditEventWarningBanner bookingCount={bookingCount} />
    </>
  );
};

export default EditEventPageHeader;
