
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface TemplateCreationDebugProps {
  debugInfo: string;
}

export const TemplateCreationDebug: React.FC<TemplateCreationDebugProps> = ({ debugInfo }) => {
  if (!debugInfo) return null;

  return (
    <div className="text-xs bg-gray-100 p-3 rounded max-h-40 overflow-y-auto">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="h-4 w-4" />
        <span className="font-medium">Debug Information:</span>
      </div>
      <pre className="whitespace-pre-wrap">{debugInfo}</pre>
    </div>
  );
};
