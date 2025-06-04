
import { supabase } from '@/integrations/supabase/client';
import { EmailTemplate } from '@/components/admin/email/types';

export interface EmailVariables {
  [key: string]: string | number | boolean;
}

export interface EmailContext {
  userId?: string;
  eventId?: string;
  bookingId?: string;
  hostId?: string;
  templateName: string;
  variables: EmailVariables;
  recipientEmail: string;
  recipientName?: string;
}

class EmailAutomationService {
  private static instance: EmailAutomationService;

  public static getInstance(): EmailAutomationService {
    if (!EmailAutomationService.instance) {
      EmailAutomationService.instance = new EmailAutomationService();
    }
    return EmailAutomationService.instance;
  }

  async sendTemplatedEmail(context: EmailContext): Promise<boolean> {
    try {
      console.log(`🎯 Triggering email: ${context.templateName} to ${context.recipientEmail}`);

      // Get the template from database
      const { data: template, error: templateError } = await supabase
        .from('email_templates')
        .select('*')
        .eq('name', context.templateName)
        .eq('status', 'Active')
        .single();

      if (templateError || !template) {
        console.error(`❌ Template "${context.templateName}" not found:`, templateError);
        return false;
      }

      // Process template with variables
      const processedContent = this.processTemplate(template.content, context.variables);
      const processedSubject = this.processTemplate(template.subject, context.variables);

      // Send email via edge function
      const { data, error } = await supabase.functions.invoke('send-automated-email', {
        body: {
          to: context.recipientEmail,
          subject: processedSubject,
          content: processedContent,
          templateId: template.id,
          context: {
            userId: context.userId,
            eventId: context.eventId,
            bookingId: context.bookingId,
            hostId: context.hostId
          }
        }
      });

      if (error) {
        console.error(`❌ Failed to send email "${context.templateName}":`, error);
        return false;
      }

      console.log(`✅ Email "${context.templateName}" sent successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Email automation error:`, error);
      return false;
    }
  }

  private processTemplate(template: string, variables: EmailVariables): string {
    let processed = template;
    
    // Replace variables in format {{variable_name}}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, String(value));
    });

    return processed;
  }

  // Action-triggered emails
  async sendBookingConfirmationEmail(bookingId: string): Promise<boolean> {
    const bookingData = await this.getBookingData(bookingId);
    if (!bookingData) return false;

    return this.sendTemplatedEmail({
      templateName: 'Booking Confirmation',
      recipientEmail: bookingData.guest_email,
      recipientName: bookingData.guest_name,
      bookingId,
      eventId: bookingData.event_id,
      variables: {
        guest_name: bookingData.guest_name,
        event_title: bookingData.event_title,
        event_date: bookingData.event_date,
        event_time: bookingData.event_time,
        booking_reference: bookingData.booking_reference,
        total_amount: bookingData.total_amount,
        number_of_tickets: bookingData.number_of_tickets
      }
    });
  }

  async sendBookingCancellationEmail(bookingId: string, refundAmount?: number): Promise<boolean> {
    const bookingData = await this.getBookingData(bookingId);
    if (!bookingData) return false;

    return this.sendTemplatedEmail({
      templateName: 'Booking Cancellation Confirmation',
      recipientEmail: bookingData.guest_email,
      recipientName: bookingData.guest_name,
      bookingId,
      variables: {
        guest_name: bookingData.guest_name,
        event_title: bookingData.event_title,
        booking_reference: bookingData.booking_reference,
        refund_amount: refundAmount || bookingData.total_amount,
        cancellation_date: new Date().toLocaleDateString()
      }
    });
  }

  async sendWelcomeEmail(userId: string, userEmail: string, userName: string): Promise<boolean> {
    return this.sendTemplatedEmail({
      templateName: 'Welcome Email',
      recipientEmail: userEmail,
      recipientName: userName,
      userId,
      variables: {
        user_name: userName,
        sign_up_date: new Date().toLocaleDateString()
      }
    });
  }

  async sendEventReminderEmail(bookingId: string, reminderType: '7_days' | '24_hours' | '2_hours'): Promise<boolean> {
    const bookingData = await this.getBookingData(bookingId);
    if (!bookingData) return false;

    const templateNames = {
      '7_days': 'Event Reminder (7 Days)',
      '24_hours': 'Event Reminder (24 Hours)',
      '2_hours': 'Event Reminder (2 Hours)'
    };

    return this.sendTemplatedEmail({
      templateName: templateNames[reminderType],
      recipientEmail: bookingData.guest_email,
      recipientName: bookingData.guest_name,
      bookingId,
      eventId: bookingData.event_id,
      variables: {
        guest_name: bookingData.guest_name,
        event_title: bookingData.event_title,
        event_date: bookingData.event_date,
        event_time: bookingData.event_time,
        event_location: bookingData.event_location
      }
    });
  }

  async sendEventUpdateEmail(eventId: string, updateType: string, updateMessage: string): Promise<boolean> {
    const attendees = await this.getEventAttendees(eventId);
    
    const results = await Promise.all(
      attendees.map(attendee => 
        this.sendTemplatedEmail({
          templateName: 'Event Update Notification',
          recipientEmail: attendee.guest_email,
          recipientName: attendee.guest_name,
          eventId,
          bookingId: attendee.booking_id,
          variables: {
            guest_name: attendee.guest_name,
            event_title: attendee.event_title,
            update_type: updateType,
            update_message: updateMessage,
            update_date: new Date().toLocaleDateString()
          }
        })
      )
    );

    return results.every(result => result);
  }

  async sendPostEventFollowUpEmail(bookingId: string): Promise<boolean> {
    const bookingData = await this.getBookingData(bookingId);
    if (!bookingData) return false;

    return this.sendTemplatedEmail({
      templateName: 'Post-Event Follow Up',
      recipientEmail: bookingData.guest_email,
      recipientName: bookingData.guest_name,
      bookingId,
      eventId: bookingData.event_id,
      variables: {
        guest_name: bookingData.guest_name,
        event_title: bookingData.event_title,
        host_name: bookingData.host_name,
        event_date: bookingData.event_date
      }
    });
  }

  // Helper methods
  private async getBookingData(bookingId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        events (
          title,
          date,
          time,
          location,
          host_id
        )
      `)
      .eq('id', bookingId)
      .single();

    if (error) {
      console.error('Error fetching booking data:', error);
      return null;
    }

    // Get host name separately to avoid complex join issues
    let hostName = 'Your Host';
    if (data.events?.host_id) {
      const { data: hostProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.events.host_id)
        .single();
      
      if (hostProfile?.full_name) {
        hostName = hostProfile.full_name;
      }
    }

    return {
      ...data,
      event_title: data.events?.title || 'Event',
      event_date: data.events?.date ? new Date(data.events.date).toLocaleDateString() : 'TBA',
      event_time: data.events?.time || 'TBA',
      event_location: typeof data.events?.location === 'object' 
        ? (data.events.location as any).address || (data.events.location as any).name || 'Location TBA'
        : 'Location TBA',
      host_name: hostName
    };
  }

  private async getEventAttendees(eventId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        guest_email,
        guest_name,
        events (title)
      `)
      .eq('event_id', eventId)
      .eq('status', 'confirmed');

    if (error) {
      console.error('Error fetching event attendees:', error);
      return [];
    }

    return data.map(booking => ({
      booking_id: booking.id,
      guest_email: booking.guest_email || '',
      guest_name: booking.guest_name || '',
      event_title: booking.events?.title || 'Event'
    }));
  }
}

export const emailAutomationService = EmailAutomationService.getInstance();
