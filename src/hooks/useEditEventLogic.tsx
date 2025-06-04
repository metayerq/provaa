
import { useNavigate } from 'react-router-dom';
import { useEventFormInitialization } from '@/hooks/useEventFormInitialization';
import { useEventSaveLogic } from '@/hooks/useEventSaveLogic';
import { useEventOperations } from '@/hooks/useEventOperations';

export const useEditEventLogic = (event: any, id: string | undefined, setEvent: any) => {
  const navigate = useNavigate();
  const { formData, setFormData } = useEventFormInitialization(event);
  const { handleSave, isSubmitting, savingAsDraft } = useEventSaveLogic();
  const { handleCapacityChange, handleStatusChange, isUpdatingCapacity } = useEventOperations();

  const handleFormSubmit = async (isDraft: boolean = false) => {
    if (id && event) {
      await handleSave(formData, isDraft, id, event, setEvent);
    }
  };

  const handlePublish = async () => {
    if (id && event) {
      await handleSave(formData, false, id, event, setEvent);
    }
  };

  const handleCapacityChangeWrapper = async (newCapacity: number) => {
    if (id) {
      console.log('🔄 EditEventLogic: Handling capacity change', {
        eventId: id,
        newCapacity,
        currentCapacity: event?.capacity
      });
      await handleCapacityChange(newCapacity, event, id, setEvent, setFormData);
    }
  };

  const handleStatusChangeWrapper = async (status: 'live' | 'paused' | 'cancelled') => {
    if (id) {
      await handleStatusChange(status, event, id, setEvent);
    }
  };

  const handleCancel = () => {
    navigate('/host/events');
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    savingAsDraft,
    isUpdatingCapacity,
    handleFormSubmit,
    handlePublish,
    handleCapacityChange: handleCapacityChangeWrapper,
    handleStatusChange: handleStatusChangeWrapper,
    handleCancel
  };
};
