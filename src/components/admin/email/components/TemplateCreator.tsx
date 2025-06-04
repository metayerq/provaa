
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useTemplateCreation } from '../hooks/useTemplateCreation';
import { TemplateCreationButton } from './TemplateCreationButton';
import { TemplateCreationDebug } from './TemplateCreationDebug';
import { TemplateCreationInfo } from './TemplateCreationInfo';

interface TemplateCreatorProps {
  onTemplatesCreated: () => void;
}

export const TemplateCreator: React.FC<TemplateCreatorProps> = ({ onTemplatesCreated }) => {
  const { isCreating, isComplete, debugInfo, createAllTemplates } = useTemplateCreation(onTemplatesCreated);

  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Complete Email Template Collection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TemplateCreationInfo />
        
        <TemplateCreationButton
          isCreating={isCreating}
          isComplete={isComplete}
          onClick={createAllTemplates}
        />

        <TemplateCreationDebug debugInfo={debugInfo} />
      </CardContent>
    </Card>
  );
};
