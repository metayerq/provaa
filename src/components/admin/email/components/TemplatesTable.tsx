
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmailTemplate } from '../types';
import { TemplateActions } from './TemplateActions';

interface TemplatesTableProps {
  templates: EmailTemplate[];
  onEdit: (templateId: string) => void;
  onPreview: (template: EmailTemplate) => void;
  onTest: (template: EmailTemplate) => void;
  onDelete: (template: EmailTemplate) => void;
}

export const TemplatesTable: React.FC<TemplatesTableProps> = ({
  templates,
  onEdit,
  onPreview,
  onTest,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.name}</TableCell>
                <TableCell>
                  <Badge variant={template.type === 'Transactional' ? 'default' : 'secondary'}>
                    {template.type}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(template.updated_at)}</TableCell>
                <TableCell>
                  <Badge variant={template.status === 'Active' ? 'default' : 'secondary'}>
                    {template.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <TemplateActions
                    template={template}
                    onEdit={onEdit}
                    onPreview={onPreview}
                    onTest={onTest}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
            {templates.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No email templates found. Create your first template to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
