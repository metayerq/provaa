
import { useCallback } from 'react';
import { emailAutomationService } from '@/services/emailAutomation/EmailAutomationService';
import { emailCampaignService } from '@/services/emailAutomation/EmailCampaignService';

export function useEmailAutomation() {
  const handleBookingSuccess = useCallback(async (bookingId: string, eventDate: string) => {
    try {
      console.log('📧 Sending booking confirmation email...');
      await emailAutomationService.sendBookingConfirmationEmail(bookingId);
      
      console.log('📅 Scheduling reminder emails...');
      await emailCampaignService.scheduleEventReminders(bookingId, eventDate);
      
      console.log('📅 Scheduling post-event follow-up...');
      await emailCampaignService.schedulePostEventFollowUp(bookingId, eventDate);
      
      console.log('✅ All booking emails scheduled successfully');
    } catch (error) {
      console.error('❌ Failed to send/schedule booking emails:', error);
      // Don't fail the booking if emails fail
    }
  }, []);

  const handleRegistrationSuccess = useCallback(async (userData: { id: string; email: string; full_name: string }) => {
    try {
      console.log('📧 Starting welcome email sequence...');
      await emailCampaignService.scheduleWelcomeSequence(
        userData.id,
        userData.email,
        userData.full_name
      );
      console.log('✅ Welcome email sequence started');
    } catch (error) {
      console.error('❌ Failed to start welcome email sequence:', error);
    }
  }, []);

  return {
    handleBookingSuccess,
    handleRegistrationSuccess
  };
}
