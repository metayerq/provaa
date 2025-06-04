
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmailTemplate } from '../types';

export const templateService = {
  async testTemplate(template: EmailTemplate): Promise<void> {
    try {
      let response;
      
      // For booking confirmation templates, use the test-email-system function
      // Check if template name contains "booking" or "confirmation" keywords
      const isBookingTemplate = template.name.toLowerCase().includes('booking') || 
                               template.name.toLowerCase().includes('confirmation');
      
      if (isBookingTemplate) {
        response = await supabase.functions.invoke('test-email-system', {
          body: { testType: 'confirmation' }
        });
      } else {
        // For other templates, use the send-test-email function
        response = await supabase.functions.invoke('send-test-email', {
          body: {
            templateId: template.id,
            testEmail: 'metayerq@gmail.com'
          }
        });
      }

      const { data, error } = response;

      if (error) {
        console.error('Test email error details:', error);
        
        let errorMessage = error.message;
        if (errorMessage.includes('domain is not verified')) {
          errorMessage = 'Domain verification issue. Your provaa.co domain should be verified in Resend.';
        } else if (errorMessage.includes('rate limit')) {
          errorMessage = 'Rate limit exceeded. Please wait before sending more test emails.';
        }
        
        throw new Error(errorMessage);
      }

      // Handle different response formats
      if (isBookingTemplate) {
        if (data?.result?.error) {
          throw new Error(data.result.error);
        }
        toast({
          title: "Booking Confirmation Test Sent",
          description: `Test booking confirmation email has been sent using real booking data.`,
        });
      } else {
        toast({
          title: "Test Email Sent",
          description: `Test email for "${template.name}" has been sent to metayerq@gmail.com.`,
        });
      }
    } catch (error: any) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send test email. Please try again.",
        variant: "destructive",
      });
    }
  },

  async deleteTemplate(template: EmailTemplate): Promise<boolean> {
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', template.id);

      if (error) throw error;

      toast({
        title: "Template Deleted",
        description: `Email template "${template.name}" has been deleted.`,
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }
};
