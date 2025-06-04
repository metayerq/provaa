
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, CheckCircle } from 'lucide-react';

interface TemplateCreationButtonProps {
  isCreating: boolean;
  isComplete: boolean;
  onClick: () => void;
}

export const TemplateCreationButton: React.FC<TemplateCreationButtonProps> = ({
  isCreating,
  isComplete,
  onClick
}) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={onClick}
        disabled={isCreating || isComplete}
        className="flex items-center gap-2"
      >
        {isCreating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Templates...
          </>
        ) : isComplete ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Templates Created!
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Create All Templates
          </>
        )}
      </Button>
      
      {isCreating && (
        <span className="text-sm text-gray-600">
          This may take a minute...
        </span>
      )}
    </div>
  );
};
