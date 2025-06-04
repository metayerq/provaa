
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'Transactional' | 'Automated';
  status: 'Active' | 'Draft';
}

interface TemplatePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplate | null;
}

export const TemplatePreviewDialog: React.FC<TemplatePreviewDialogProps> = ({
  open,
  onOpenChange,
  template,
}) => {
  if (!template) return null;

  // Replace template variables with sample data for preview
  const replaceVariables = (text: string) => {
    return text
      .replace(/\{\{user_name\}\}/g, 'John Doe')
      .replace(/\{\{event_title\}\}/g, 'Wine Tasting Evening')
      .replace(/\{\{event_date\}\}/g, 'Saturday, May 27, 2025')
      .replace(/\{\{event_time\}\}/g, '7:00 PM')
      .replace(/\{\{event_location\}\}/g, '123 Wine Street, Lisboa')
      .replace(/\{\{booking_ref\}\}/g, 'BK-12345678')
      .replace(/\{\{host_name\}\}/g, 'Maria Silva')
      .replace(/\{\{total_amount\}\}/g, '€45.00');
  };

  const previewSubject = replaceVariables(template.subject);
  const previewContent = replaceVariables(template.content);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Template Preview: {template.name}
            <Badge variant="secondary">Preview Mode</Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="bg-white p-6 rounded border shadow-sm">
              <div className="border-b pb-4 mb-4">
                <h3 className="font-semibold">Subject: {previewSubject}</h3>
                <p className="text-sm text-gray-600">From: Tastee &lt;hello@tastee.com&gt;</p>
                <div className="mt-2">
                  <Badge variant={template.type === 'Transactional' ? 'default' : 'secondary'}>
                    {template.type}
                  </Badge>
                  <Badge variant={template.status === 'Active' ? 'default' : 'outline'} className="ml-2">
                    {template.status}
                  </Badge>
                </div>
              </div>
              <div 
                className="space-y-4"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <p>Variables like {"{{user_name}}"} and {"{{event_title}}"} will be replaced with actual values when sent.</p>
            <p className="mt-1">This preview shows sample data to demonstrate how the email will appear to recipients.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
