import React from 'react';
import { EventForm } from './types';
import EventTypeStep from '../steps/EventTypeStep';
import BasicInfoStep from '../steps/BasicInfoStep';
import ExperienceDetailsStep from '../steps/ExperienceDetailsStep';
import ProductsStep from '../steps/ProductsStep';
import PracticalDetailsStep from '../steps/PracticalDetailsStep';
import PricingStep from '../steps/PricingStep';
import PreviewStep from '../steps/PreviewStep';

interface StepContentProps {
  currentStep: number;
  formData: EventForm;
  setFormData: React.Dispatch<React.SetStateAction<EventForm>>;
  isEditing?: boolean;
}

const StepContent: React.FC<StepContentProps> = ({ 
  currentStep, 
  formData, 
  setFormData, 
  isEditing 
}) => {
  const stepProps = {
    formData,
    setFormData,
    isEditing
  };

  switch (currentStep) {
    case 0:
      return <EventTypeStep {...stepProps} />;
    case 1:
      return <BasicInfoStep {...stepProps} />;
    case 2:
      return <ExperienceDetailsStep {...stepProps} />;
    case 3:
      return <ProductsStep {...stepProps} />;
    case 4:
      return <PracticalDetailsStep {...stepProps} />;
    case 5:
      return <PricingStep {...stepProps} />;
    case 6:
      return <PreviewStep formData={formData} />;
    default:
      return null;
  }
};

export default StepContent;
