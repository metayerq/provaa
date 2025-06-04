
import { supabase } from '@/integrations/supabase/client';
import { emailAutomationService } from './EmailAutomationService';

interface CampaignSchedule {
  id: string;
  type: 'reminder' | 'follow_up' | 'welcome_sequence';
  triggerDate: Date;
  bookingId?: string;
  userId?: string;
  eventId?: string;
  status: 'pending' | 'sent' | 'failed';
}

class EmailCampaignService {
  private static instance: EmailCampaignService;

  public static getInstance(): EmailCampaignService {
    if (!EmailCampaignService.instance) {
      EmailCampaignService.instance = new EmailCampaignService();
    }
    return EmailCampaignService.instance;
  }

  // Schedule reminder emails for a booking
  async scheduleEventReminders(bookingId: string, eventDate: string): Promise<void> {
    const eventDateTime = new Date(eventDate);
    const now = new Date();

    // Schedule 7-day reminder
    const sevenDaysReminder = new Date(eventDateTime);
    sevenDaysReminder.setDate(sevenDaysReminder.getDate() - 7);
    
    if (sevenDaysReminder > now) {
      await this.scheduleEmail({
        type: 'reminder',
        triggerDate: sevenDaysReminder,
        bookingId,
        reminderType: '7_days'
      });
    }

    // Schedule 24-hour reminder
    const oneDayReminder = new Date(eventDateTime);
    oneDayReminder.setDate(oneDayReminder.getDate() - 1);
    
    if (oneDayReminder > now) {
      await this.scheduleEmail({
        type: 'reminder',
        triggerDate: oneDayReminder,
        bookingId,
        reminderType: '24_hours'
      });
    }

    // Schedule 2-hour reminder
    const twoHourReminder = new Date(eventDateTime);
    twoHourReminder.setHours(twoHourReminder.getHours() - 2);
    
    if (twoHourReminder > now) {
      await this.scheduleEmail({
        type: 'reminder',
        triggerDate: twoHourReminder,
        bookingId,
        reminderType: '2_hours'
      });
    }

    console.log(`📅 Scheduled reminder emails for booking ${bookingId}`);
  }

  // Schedule post-event follow-up
  async schedulePostEventFollowUp(bookingId: string, eventDate: string): Promise<void> {
    const eventDateTime = new Date(eventDate);
    const followUpDate = new Date(eventDateTime);
    followUpDate.setDate(followUpDate.getDate() + 1); // Next day after event

    await this.scheduleEmail({
      type: 'follow_up',
      triggerDate: followUpDate,
      bookingId
    });

    console.log(`📅 Scheduled post-event follow-up for booking ${bookingId}`);
  }

  // Schedule welcome email sequence for new users
  async scheduleWelcomeSequence(userId: string, userEmail: string, userName: string): Promise<void> {
    // Immediate welcome email
    await emailAutomationService.sendWelcomeEmail(userId, userEmail, userName);

    // Schedule profile completion reminder (if needed) after 3 days
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 3);

    await this.scheduleEmail({
      type: 'welcome_sequence',
      triggerDate: reminderDate,
      userId,
      sequenceStep: 'profile_completion'
    });

    console.log(`📅 Scheduled welcome sequence for user ${userId}`);
  }

  // Process scheduled emails (this would be called by a cron job)
  async processPendingEmails(): Promise<void> {
    console.log('⏰ Processing pending scheduled emails...');

    // This would typically be implemented as a Supabase Edge Function
    // called by a cron job to check for emails that need to be sent
    
    // For now, we'll invoke the edge function directly
    try {
      const { data, error } = await supabase.functions.invoke('process-scheduled-emails');
      
      if (error) {
        console.error('❌ Failed to process scheduled emails:', error);
      } else {
        console.log('✅ Processed scheduled emails:', data);
      }
    } catch (error) {
      console.error('❌ Error processing scheduled emails:', error);
    }
  }

  private async scheduleEmail(schedule: {
    type: string;
    triggerDate: Date;
    bookingId?: string;
    userId?: string;
    eventId?: string;
    reminderType?: string;
    sequenceStep?: string;
  }): Promise<void> {
    // Store scheduled email in database
    const { error } = await supabase
      .from('scheduled_emails')
      .insert({
        type: schedule.type,
        trigger_date: schedule.triggerDate.toISOString(),
        booking_id: schedule.bookingId,
        user_id: schedule.userId,
        event_id: schedule.eventId,
        metadata: {
          reminder_type: schedule.reminderType,
          sequence_step: schedule.sequenceStep
        },
        status: 'pending'
      });

    if (error) {
      console.error('❌ Failed to schedule email:', error);
    }
  }
}

export const emailCampaignService = EmailCampaignService.getInstance();
