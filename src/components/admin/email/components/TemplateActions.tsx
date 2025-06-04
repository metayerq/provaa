
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Eye, TestTube, Trash2 } from 'lucide-react';
import { EmailTemplate } from '../types';

interface TemplateActionsProps {
  template: EmailTemplate;
  onEdit: (templateId: string) => void;
  onPreview: (template: EmailTemplate) => void;
  onTest: (template: EmailTemplate) => void;
  onDelete: (template: EmailTemplate) => void;
}

export const TemplateActions: React.FC<TemplateActionsProps> = ({
  template,
  onEdit,
  onPreview,
  onTest,
  onDelete
}) => {
  return (
    <div className="flex space-x-2">
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onEdit(template.id)}
        title="Edit template"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onPreview(template)}
        title="Preview template"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onTest(template)}
        title="Send test email"
      >
        <TestTube className="h-4 w-4" />
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onDelete(template)}
        title="Delete template"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
