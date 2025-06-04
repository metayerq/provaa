
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { edgeFunctionService } from '../services/edgeFunctionService';
import { templateCreationService } from '../services/templateCreationService';

interface TemplateCreationHook {
  isCreating: boolean;
  isComplete: boolean;
  debugInfo: string;
  createAllTemplates: () => Promise<void>;
}

export const useTemplateCreation = (onTemplatesCreated: () => void): TemplateCreationHook => {
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const createAllTemplates = async () => {
    setIsCreating(true);
    setDebugInfo('🚀 Starting comprehensive template creation process...\n');
    
    try {
      // Step 1: Test direct function access
      setDebugInfo(prev => prev + '\n📡 Step 1: Testing direct edge function access...\n');
      const directTest = await edgeFunctionService.testFunctionAccess();
      setDebugInfo(prev => prev + `Direct test result: ${JSON.stringify(directTest, null, 2)}\n`);

      let templatesCreated = 0;
      let creationMethod = '';

      // Step 2: Try edge function first
      if (directTest.success) {
        setDebugInfo(prev => prev + '\n🎯 Step 2: Edge function accessible, attempting creation...\n');
        const edgeResult = await templateCreationService.tryEdgeFunction();
        setDebugInfo(prev => prev + `Edge function result: ${JSON.stringify(edgeResult, null, 2)}\n`);
        
        if (edgeResult.success && edgeResult.count && edgeResult.count > 0) {
          templatesCreated = edgeResult.count;
          creationMethod = 'Edge Function';
        }
      }

      // Step 3: Fallback to direct database insertion if edge function failed
      if (templatesCreated === 0) {
        setDebugInfo(prev => prev + '\n🔧 Step 3: Edge function failed or inaccessible, using direct database insertion...\n');
        const directResult = await templateCreationService.createTemplatesDirectly();
        setDebugInfo(prev => prev + `Direct insertion result: ${JSON.stringify(directResult, null, 2)}\n`);
        
        if (directResult.success) {
          templatesCreated = directResult.count;
          creationMethod = 'Direct Database';
        } else {
          throw new Error(directResult.error || 'Direct database insertion failed');
        }
      }

      // Step 4: Success handling
      if (templatesCreated > 0) {
        console.log(`✅ Successfully created ${templatesCreated} templates via ${creationMethod}`);
        setDebugInfo(prev => prev + `\n✅ SUCCESS: Created ${templatesCreated} templates via ${creationMethod}\n`);
        
        toast({
          title: "Email Templates Created Successfully! 🎉",
          description: `Created ${templatesCreated} professional email templates via ${creationMethod}. The complete email lifecycle is now available.`,
        });

        setIsComplete(true);
        
        // Reload templates after a short delay
        setTimeout(() => {
          onTemplatesCreated();
        }, 2000);
        
        // Reset completion status after a few seconds
        setTimeout(() => setIsComplete(false), 8000);
      } else {
        throw new Error('No templates were created by any method');
      }
      
    } catch (error: any) {
      console.error('❌ Template creation failed:', error);
      setDebugInfo(prev => prev + `\n❌ FINAL ERROR: ${error.message}\n`);
      
      toast({
        title: "Template Creation Error",
        description: `Failed to create templates: ${error.message}. Check the debug panel for details.`,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    isComplete,
    debugInfo,
    createAllTemplates
  };
};
