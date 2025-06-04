
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log('⏰ Processing scheduled emails...');

    // Get emails that are due to be sent
    const { data: scheduledEmails, error: fetchError } = await supabase
      .from('scheduled_emails')
      .select('*')
      .eq('status', 'pending')
      .lte('trigger_date', new Date().toISOString())
      .limit(50); // Process in batches

    if (fetchError) {
      throw new Error(`Failed to fetch scheduled emails: ${fetchError.message}`);
    }

    console.log(`📅 Found ${scheduledEmails?.length || 0} emails to process`);

    if (!scheduledEmails || scheduledEmails.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No scheduled emails to process', processed: 0 }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    let processedCount = 0;
    let failedCount = 0;

    // Process each scheduled email
    for (const scheduledEmail of scheduledEmails) {
      try {
        console.log(`📧 Processing scheduled email: ${scheduledEmail.type} for ${scheduledEmail.booking_id || scheduledEmail.user_id}`);

        let emailSent = false;

        switch (scheduledEmail.type) {
          case 'reminder':
            emailSent = await processReminderEmail(supabase, scheduledEmail);
            break;
          case 'follow_up':
            emailSent = await processFollowUpEmail(supabase, scheduledEmail);
            break;
          case 'welcome_sequence':
            emailSent = await processWelcomeSequenceEmail(supabase, scheduledEmail);
            break;
          default:
            console.warn(`Unknown email type: ${scheduledEmail.type}`);
            continue;
        }

        // Update status
        const newStatus = emailSent ? 'sent' : 'failed';
        await supabase
          .from('scheduled_emails')
          .update({ 
            status: newStatus, 
            processed_at: new Date().toISOString(),
            error_message: emailSent ? null : 'Failed to send email'
          })
          .eq('id', scheduledEmail.id);

        if (emailSent) {
          processedCount++;
          console.log(`✅ Successfully processed email ${scheduledEmail.id}`);
        } else {
          failedCount++;
          console.log(`❌ Failed to process email ${scheduledEmail.id}`);
        }

      } catch (error) {
        console.error(`❌ Error processing email ${scheduledEmail.id}:`, error);
        failedCount++;
        
        // Mark as failed
        await supabase
          .from('scheduled_emails')
          .update({ 
            status: 'failed', 
            processed_at: new Date().toISOString(),
            error_message: error.message
          })
          .eq('id', scheduledEmail.id);
      }
    }

    console.log(`📊 Email processing complete. Processed: ${processedCount}, Failed: ${failedCount}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Scheduled emails processed', 
        processed: processedCount,
        failed: failedCount,
        total: scheduledEmails.length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('❌ Error in process-scheduled-emails function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

async function processReminderEmail(supabase: any, scheduledEmail: any): Promise<boolean> {
  const reminderType = scheduledEmail.metadata?.reminder_type;
  
  // Get booking data
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      *,
      events!inner (title, date, time, location)
    `)
    .eq('id', scheduledEmail.booking_id)
    .eq('status', 'confirmed')
    .single();

  if (error || !booking) {
    console.log(`Booking ${scheduledEmail.booking_id} no longer exists or is not confirmed`);
    return false;
  }

  // Send reminder email via automation service
  const { error: emailError } = await supabase.functions.invoke('send-automated-email', {
    body: {
      templateId: getTemplateIdForReminder(reminderType),
      to: booking.guest_email,
      subject: `Reminder: ${booking.events.title} is ${getReminderTimeText(reminderType)}`,
      content: buildReminderContent(booking, reminderType),
      context: {
        bookingId: booking.id,
        eventId: booking.event_id
      }
    }
  });

  return !emailError;
}

async function processFollowUpEmail(supabase: any, scheduledEmail: any): Promise<boolean> {
  // Get booking data
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      *,
      events!inner (title, date, host_id),
      profiles!bookings_user_id_fkey (full_name as host_name)
    `)
    .eq('id', scheduledEmail.booking_id)
    .single();

  if (error || !booking) {
    console.log(`Booking ${scheduledEmail.booking_id} no longer exists`);
    return false;
  }

  // Send follow-up email
  const { error: emailError } = await supabase.functions.invoke('send-automated-email', {
    body: {
      templateId: 'post-event-follow-up',
      to: booking.guest_email,
      subject: `How was your experience at ${booking.events.title}?`,
      content: buildFollowUpContent(booking),
      context: {
        bookingId: booking.id,
        eventId: booking.event_id,
        hostId: booking.events.host_id
      }
    }
  });

  return !emailError;
}

async function processWelcomeSequenceEmail(supabase: any, scheduledEmail: any): Promise<boolean> {
  const sequenceStep = scheduledEmail.metadata?.sequence_step;
  
  if (sequenceStep === 'profile_completion') {
    // Check if user has completed their profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('bio, location, avatar_url')
      .eq('id', scheduledEmail.user_id)
      .single();

    // If profile is complete, skip this email
    if (profile?.bio && profile?.location && profile?.avatar_url) {
      console.log(`User ${scheduledEmail.user_id} has completed profile, skipping reminder`);
      return true; // Mark as sent to prevent resending
    }

    // Send profile completion reminder
    const { error: emailError } = await supabase.functions.invoke('send-automated-email', {
      body: {
        templateId: 'profile-completion-reminder',
        to: profile.email,
        subject: 'Complete your Provaa profile to get the most out of our platform',
        content: buildProfileCompletionContent(),
        context: {
          userId: scheduledEmail.user_id
        }
      }
    });

    return !emailError;
  }

  return false;
}

function getTemplateIdForReminder(reminderType: string): string {
  const templateMap = {
    '7_days': 'event-reminder-7-days',
    '24_hours': 'event-reminder-24-hours',
    '2_hours': 'event-reminder-2-hours'
  };
  return templateMap[reminderType] || 'event-reminder-24-hours';
}

function getReminderTimeText(reminderType: string): string {
  const timeMap = {
    '7_days': 'in one week',
    '24_hours': 'tomorrow',
    '2_hours': 'in 2 hours'
  };
  return timeMap[reminderType] || 'soon';
}

function buildReminderContent(booking: any, reminderType: string): string {
  const timeText = getReminderTimeText(reminderType);
  
  return `
    <h2>Don't forget - ${booking.events.title} is ${timeText}!</h2>
    
    <p>Hi ${booking.guest_name},</p>
    
    <p>This is a friendly reminder about your upcoming culinary experience:</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>${booking.events.title}</h3>
      <p><strong>Date:</strong> ${new Date(booking.events.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${booking.events.time}</p>
      <p><strong>Booking Reference:</strong> ${booking.booking_reference}</p>
    </div>
    
    <p>We're excited to see you there!</p>
    
    <p>If you have any questions or need to make changes, please contact us as soon as possible.</p>
  `;
}

function buildFollowUpContent(booking: any): string {
  return `
    <h2>How was your experience at ${booking.events.title}?</h2>
    
    <p>Hi ${booking.guest_name},</p>
    
    <p>We hope you had an amazing time at ${booking.events.title} yesterday!</p>
    
    <p>Your feedback is incredibly valuable to us and helps other food enthusiasts discover great experiences.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${Deno.env.get('SITE_URL')}/bookings" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Share Your Review
      </a>
    </div>
    
    <p>Thank you for choosing Provaa for your culinary adventure!</p>
  `;
}

function buildProfileCompletionContent(): string {
  return `
    <h2>Complete your Provaa profile</h2>
    
    <p>Hi there!</p>
    
    <p>We noticed you haven't completed your Provaa profile yet. Adding a bio, location, and profile photo helps you:</p>
    
    <ul>
      <li>Get personalized event recommendations</li>
      <li>Connect with hosts and other food enthusiasts</li>
      <li>Build trust with the Provaa community</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${Deno.env.get('SITE_URL')}/profile" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Complete Your Profile
      </a>
    </div>
    
    <p>It only takes a few minutes and makes your Provaa experience so much better!</p>
  `;
}

serve(handler);
