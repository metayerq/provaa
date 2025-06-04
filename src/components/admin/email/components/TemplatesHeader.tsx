
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TemplatesHeaderProps {
  onCreateTemplate: () => void;
}

export const TemplatesHeader: React.FC<TemplatesHeaderProps> = ({ onCreateTemplate }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Email Templates</h2>
        <p className="text-gray-600">Manage your email templates for different event scenarios</p>
      </div>
      <Button onClick={onCreateTemplate} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Create Template
      </Button>
    </div>
  );
};
