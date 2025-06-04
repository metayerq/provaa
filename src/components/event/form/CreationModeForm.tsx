import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EventForm } from './types';
import { useStepValidation } from './useStepValidation';
import ProgressIndicator from './ProgressIndicator';
import StepContent from './StepContent';
import StepNavigation from './StepNavigation';

interface CreationModeFormProps {
  formData: EventForm;
  setFormData: React.Dispatch<React.SetStateAction<EventForm>>;
  isSubmitting: boolean;
  savingAsDraft: boolean;
  onSubmit: (isDraft?: boolean) => Promise<void>;
}

const CreationModeForm: React.FC<CreationModeFormProps> = ({
  formData,
  setFormData,
  isSubmitting,
  savingAsDraft,
  onSubmit
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const { validateCurrentStep } = useStepValidation(formData);

  const nextStep = () => {
    const isCurrentStepValid = validateCurrentStep(currentStep);
    
    if (isCurrentStepValid) {
      if (currentStep < 6) { // Updated to 6 since we removed SEO step
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    } else {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="space-y-6">
      <ProgressIndicator currentStep={currentStep} />
      
      <div className="bg-gray-50 rounded-xl p-6 md:p-8 mb-6">
        <StepContent 
          currentStep={currentStep}
          formData={formData}
          setFormData={setFormData}
          isEditing={false}
        />
        
        <StepNavigation
          currentStep={currentStep}
          isSubmitting={isSubmitting}
          savingAsDraft={savingAsDraft}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default CreationModeForm;
