
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmailTemplate } from '../types';

export const useTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTemplates = async () => {
    try {
      console.log('📧 Loading email templates...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('📧 Templates query result:', { 
        data: data?.length, 
        error, 
        names: data?.map(t => t.name) 
      });

      if (error) {
        console.error('❌ Error loading templates:', error);
        throw error;
      }

      // Transform the data to match our TypeScript interface
      const typedTemplates: EmailTemplate[] = (data || []).map(template => ({
        id: template.id,
        name: template.name,
        subject: template.subject,
        content: template.content,
        type: template.type as 'Transactional' | 'Automated',
        status: template.status as 'Active' | 'Draft',
        created_at: template.created_at,
        updated_at: template.updated_at,
        created_by: template.created_by,
        updated_by: template.updated_by
      }));

      console.log('📧 Successfully loaded templates:', {
        count: typedTemplates.length,
        types: typedTemplates.reduce((acc: any, t) => {
          acc[t.type] = (acc[t.type] || 0) + 1;
          return acc;
        }, {}),
        statuses: typedTemplates.reduce((acc: any, t) => {
          acc[t.status] = (acc[t.status] || 0) + 1;
          return acc;
        }, {})
      });

      setTemplates(typedTemplates);
    } catch (error: any) {
      console.error('❌ Error loading templates:', error);
      toast({
        title: "Template Loading Error",
        description: `Failed to load email templates: ${error.message}. Please check the console for details.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const forceReload = async () => {
    console.log('🔄 Force reloading templates...');
    await loadTemplates();
    toast({
      title: "Templates Refreshed",
      description: `Loaded ${templates.length} email templates.`,
    });
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return {
    templates,
    isLoading,
    loadTemplates,
    forceReload
  };
};
