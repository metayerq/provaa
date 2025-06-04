
import React from 'react';
import { CategorySelector } from '../CategorySelector';
import { EventForm } from '../form/types';

interface EventTypeStepProps {
  formData: EventForm;
  setFormData: React.Dispatch<React.SetStateAction<EventForm>>;
  isEditing?: boolean;
}

const EventTypeStep: React.FC<EventTypeStepProps> = ({ 
  formData, 
  setFormData 
}) => {
  const handleCategorySelect = (categoryId: string) => {
    setFormData(prev => ({ ...prev, category: categoryId }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What Type of Experience Are You Hosting?</h2>
        <p className="text-gray-600">Choose the category that best describes your tasting event, or create your own.</p>
      </div>
      
      <CategorySelector
        selectedCategory={formData.category}
        onCategorySelect={handleCategorySelect}
      />
    </div>
  );
};

export default EventTypeStep;
