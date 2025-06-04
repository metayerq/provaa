
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Loader2, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { templateCreationService } from '../services/templateCreationService';

interface ManualTemplateCreatorProps {
  onTemplatesCreated: () => void;
}

export const ManualTemplateCreator: React.FC<ManualTemplateCreatorProps> = ({ onTemplatesCreated }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const createAllTemplatesDirectly = async () => {
    setIsCreating(true);
    
    try {
      console.log('🔧 Creating complete template collection via database...');
      
      const result = await templateCreationService.createTemplatesDirectly();

      if (result.success) {
        console.log(`✅ Created ${result.count} templates successfully`);

        toast({
          title: "Complete Template Collection Created! 🎉",
          description: `Successfully created ${result.count} professional email templates covering the entire event lifecycle.`,
        });

        setIsComplete(true);
        
        // Reload templates
        setTimeout(() => {
          onTemplatesCreated();
        }, 1500);

        // Reset completion status
        setTimeout(() => setIsComplete(false), 6000);

      } else {
        throw new Error(result.error || 'Failed to create templates');
      }

    } catch (error: any) {
      console.error('❌ Error creating complete template collection:', error);
      toast({
        title: "Template Creation Error",
        description: error.message || "Failed to create the complete template collection.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="border-green-200 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Database className="h-5 w-5" />
          Complete Template Collection Creator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p className="mb-3">Create the complete collection of 22 professional email templates:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="font-medium text-gray-800 mb-1">User Journey:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Welcome & Verification</li>
                <li>Profile & Password</li>
                <li>Payment Processing</li>
                <li>Booking Confirmations</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-800 mb-1">Event Lifecycle:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Reminders & Updates</li>
                <li>Cancellations & Refunds</li>
                <li>Post-Event Follow-up</li>
                <li>Reviews & Photos</li>
              </ul>
            </div>
          </div>
        </div>
        
        <Button
          onClick={createAllTemplatesDirectly}
          disabled={isCreating || isComplete}
          className="flex items-center gap-2 w-full"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Complete Collection...
            </>
          ) : isComplete ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Collection Created Successfully!
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              Create Complete Template Collection
            </>
          )}
        </Button>

        {isCreating && (
          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
            <p>Creating all 22 templates directly in the database...</p>
            <p>This includes templates for the complete user and event lifecycle.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
