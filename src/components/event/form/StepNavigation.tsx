
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  isSubmitting: boolean;
  savingAsDraft: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: (isDraft?: boolean) => Promise<void>;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  isSubmitting,
  savingAsDraft,
  onPrevStep,
  onNextStep,
  onSubmit
}) => {
  const isLastStep = currentStep === 7; // Updated to 7 for SEO step
  const isFirstStep = currentStep === 0;

  return (
    <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={isFirstStep}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSubmit(true)}
          disabled={isSubmitting}
        >
          {savingAsDraft ? 'Saving...' : 'Save as Draft'}
        </Button>

        {isLastStep ? (
          <Button
            type="button"
            className="bg-emerald-700 hover:bg-emerald-800"
            onClick={() => onSubmit(false)}
            disabled={isSubmitting}
          >
            {isSubmitting && !savingAsDraft ? 'Publishing...' : 'Publish Experience'}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNextStep}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;
