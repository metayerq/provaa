
import React from 'react';
import { useParams } from 'react-router-dom';
import { useEventData } from '@/hooks/useEventData';
import { useEditEventLogic } from '@/hooks/useEditEventLogic';
import Layout from '@/components/layout/Layout';
import EditEventPageHeader from '@/components/event/edit/EditEventPageHeader';
import EditEventContent from '@/components/event/edit/EditEventContent';

const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const { event, bookingCount, isLoading, setEvent } = useEventData(id);
  
  const {
    formData,
    setFormData,
    isSubmitting,
    savingAsDraft,
    isUpdatingCapacity,
    handleFormSubmit,
    handlePublish,
    handleCapacityChange,
    handleStatusChange,
    handleCancel
  } = useEditEventLogic(event, id, setEvent);

  console.log('🔍 EditEventPage render:', {
    eventId: id,
    hasEvent: !!event,
    isLoading,
    eventTitle: event?.title,
    formDataTitle: formData.title,
    eventStatus: event?.status,
    currentCapacity: event?.capacity,
    formDataCapacity: formData.capacity,
    isUpdatingCapacity
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading event...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Event not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EditEventPageHeader
          event={event}
          bookingCount={bookingCount}
          isSaving={isSubmitting}
          savingAsDraft={savingAsDraft}
          formData={formData}
          onSave={() => handleFormSubmit(false)}
          onSaveAsDraft={() => handleFormSubmit(true)}
          onPublish={handlePublish}
          onCancel={handleCancel}
        />

        <EditEventContent
          event={event}
          eventId={id!}
          bookingCount={bookingCount}
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          savingAsDraft={savingAsDraft}
          onFormSubmit={handleFormSubmit}
          onCapacityChange={handleCapacityChange}
          onStatusChange={handleStatusChange}
          isUpdatingCapacity={isUpdatingCapacity}
        />
      </div>
    </Layout>
  );
};

export default EditEventPage;
