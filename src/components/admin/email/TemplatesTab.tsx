import React, { useState } from 'react';
import { CreateTemplateDialog } from './dialogs/CreateTemplateDialog';
import { EditTemplateDialog } from './dialogs/EditTemplateDialog';
import { TemplatePreviewDialog } from './dialogs/TemplatePreviewDialog';
import { TemplatesHeader } from './components/TemplatesHeader';
import { TemplatesTable } from './components/TemplatesTable';
import { TemplateCreator } from './components/TemplateCreator';
import { ManualTemplateCreator } from './components/ManualTemplateCreator';
import { useTemplates } from './hooks/useTemplates';
import { templateService } from './services/templateService';
import { EmailTemplate } from './types';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export const TemplatesTab: React.FC = () => {
  const { templates, isLoading, loadTemplates, forceReload } = useTemplates();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  const handleCreateTemplate = () => {
    setCreateDialogOpen(true);
  };

  const handleEditTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setEditDialogOpen(true);
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setPreviewDialogOpen(true);
  };

  const handleTestTemplate = async (template: EmailTemplate) => {
    await templateService.testTemplate(template);
  };

  const handleDeleteTemplate = async (template: EmailTemplate) => {
    const deleted = await templateService.deleteTemplate(template);
    if (deleted) {
      loadTemplates();
    }
  };

  // Show template creator if no templates exist or very few templates
  const showTemplateCreator = templates.length < 5; // Show creators if less than 5 templates

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <TemplatesHeader onCreateTemplate={handleCreateTemplate} />
          <div className="text-sm text-gray-500">
            {templates.length} template{templates.length !== 1 ? 's' : ''} loaded
          </div>
        </div>
        <Button
          onClick={forceReload}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {showTemplateCreator && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">Complete Your Email System</h3>
            <p className="text-sm text-yellow-700">
              You currently have {templates.length} email template{templates.length !== 1 ? 's' : ''}. 
              For a complete email system, we recommend creating all 22 professional templates covering the entire user and event lifecycle.
            </p>
          </div>
          
          <TemplateCreator onTemplatesCreated={loadTemplates} />
          <ManualTemplateCreator onTemplatesCreated={loadTemplates} />
        </div>
      )}

      <TemplatesTable
        templates={templates}
        onEdit={handleEditTemplate}
        onPreview={handlePreviewTemplate}
        onTest={handleTestTemplate}
        onDelete={handleDeleteTemplate}
      />

      <CreateTemplateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onTemplateCreated={loadTemplates}
      />

      <EditTemplateDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        templateId={selectedTemplateId}
        onTemplateUpdated={loadTemplates}
      />

      <TemplatePreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        template={selectedTemplate}
      />
    </div>
  );
};
