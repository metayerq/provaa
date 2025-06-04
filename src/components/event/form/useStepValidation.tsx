
import { EventForm } from './types';

export const useStepValidation = (formData: EventForm) => {
  const validateCurrentStep = (currentStep: number): boolean => {
    console.log('Validating step:', currentStep, {
      hasImage: !!formData.image,
      imageSize: formData.image?.size
    });

    switch (currentStep) {
      case 0: // Experience Type
        return !!formData.category;
      case 1: // Basic Info
        const basicValid = !!(formData.title && formData.description);
        console.log('Basic info validation:', { 
          title: !!formData.title, 
          description: !!formData.description,
          hasImage: !!formData.image,
          valid: basicValid 
        });
        return basicValid;
      case 2: // Experience Details
        return !!(formData.ambianceDescription && formData.date && formData.time && formData.duration);
      case 3: // Products (now optional)
        return true; // Always valid since products are optional
      case 4: // Practical Details
        if (formData.isOnline) return true;
        return !!(formData.venueName && formData.address && formData.city && formData.meetingPointDetails);
      case 5: // Pricing
        return formData.price >= 0 && formData.capacity > 0;
      default:
        return true;
    }
  };

  return { validateCurrentStep };
};
