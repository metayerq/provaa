
import React, { useState } from 'react';
import { CreateEventFormProps } from './form/types';
import { useFormData } from './form/useFormData';
import EditingModeForm from './form/EditingModeForm';
import CreationModeForm from './form/CreationModeForm';

const CreateEventForm: React.FC<CreateEventFormProps> = ({ 
  initialData, 
  onSave, 
  isEditing = false 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingAsDraft, setSavingAsDraft] = useState(false);
  const { formData, setFormData } = useFormData(initialData);

  const handleSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true);
    setSavingAsDraft(isDraft);
    
    try {
      await onSave(formData, isDraft);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
      setSavingAsDraft(false);
    }
  };

  if (isEditing) {
    return (
      <EditingModeForm
        formData={formData}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
        savingAsDraft={savingAsDraft}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <CreationModeForm
      formData={formData}
      setFormData={setFormData}
      isSubmitting={isSubmitting}
      savingAsDraft={savingAsDraft}
      onSubmit={handleSubmit}
    />
  );
};

export default CreateEventForm;
