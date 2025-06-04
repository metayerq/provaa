
import React from 'react';
import { EventForm } from '../form/types';

interface HostInfoStepProps {
  formData: EventForm;
  setFormData: React.Dispatch<React.SetStateAction<EventForm>>;
  isEditing?: boolean;
}

const HostInfoStep: React.FC<HostInfoStepProps> = ({ 
  formData, 
  setFormData 
}) => {
  // This step is no longer needed since host info was removed from EventForm
  // Redirecting to basic info or showing a placeholder
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Host Information</h2>
      <p className="text-gray-600">Host information has been moved to a separate profile section.</p>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-700">
          This step is no longer part of the event creation process. 
          Host information is now managed through your profile settings.
        </p>
      </div>
    </div>
  );
};

export default HostInfoStep;
