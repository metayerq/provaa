
import { supabase } from '@/integrations/supabase/client';

export interface EmailTemplateDefinition {
  name: string;
  type: 'Transactional' | 'Automated';
  subject: string;
  content: string;
  status: 'Active' | 'Draft';
}

export const emailTemplateDefinitions: EmailTemplateDefinition[] = [
  {
    name: "Welcome Email",
    type: "Transactional",
    subject: "Welcome to Provaa! 🎉",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #059669; margin: 0;">Welcome to Provaa!</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>Welcome to Provaa! We're thrilled to have you join our community of food lovers and experience seekers.</p>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">What's Next?</h3>
          <ul style="color: #065f46;">
            <li>Complete your profile to personalize your experience</li>
            <li>Browse amazing culinary events in your area</li>
            <li>Connect with passionate hosts and fellow food enthusiasts</li>
            <li>Book your first unforgettable experience</li>
          </ul>
        </div>
        
        <p>Ready to start exploring? Discover amazing culinary experiences waiting for you!</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Explore Events</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Welcome aboard,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Account Verification",
    type: "Transactional",
    subject: "Please verify your email address",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #059669; margin: 0;">Verify Your Email</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>Thank you for signing up for Provaa! To complete your registration and start booking amazing culinary experiences, please verify your email address.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">If you didn't create an account with Provaa, you can safely ignore this email.</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Password Reset",
    type: "Transactional",
    subject: "Reset your Provaa password",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #059669; margin: 0;">Password Reset</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>We received a request to reset your password for your Provaa account. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">This link will expire in 24 hours for security reasons.</p>
        <p style="color: #6b7280; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email.</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Profile Completion Reminder",
    type: "Automated",
    subject: "Complete your profile to get personalized recommendations",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <p>Hi {{user_name}},</p>
        
        <p>We noticed your profile is still incomplete. Complete it now to get personalized event recommendations!</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">Why complete your profile?</h3>
          <ul style="color: #92400e;">
            <li>Get personalized event recommendations</li>
            <li>Connect with like-minded food enthusiasts</li>
            <li>Let hosts know about your dietary preferences</li>
            <li>Build trust within the community</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Complete Profile</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Happy exploring,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Payment Failed",
    type: "Transactional",
    subject: "Payment failed for {{event_title}}",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #fef2f2; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #dc2626; margin: 0;">Payment Issue</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>We encountered an issue processing your payment for <strong>{{event_title}}</strong> on {{event_date}}.</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="color: #dc2626; margin-top: 0;">What happened?</h3>
          <p style="color: #991b1b;">Your payment could not be processed. This might be due to insufficient funds, an expired card, or a temporary issue with your payment method.</p>
        </div>
        
        <p>Don't worry! You can try again with the same or a different payment method. Your spot is being held for 30 minutes.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Retry Payment</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Need help? Contact our support team.<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Payment Processing",
    type: "Transactional",
    subject: "We're processing your payment for {{event_title}}",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #fef3c7; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #d97706; margin: 0;">Payment Processing</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>We're currently processing your payment for <strong>{{event_title}}</strong>. This usually takes just a few minutes.</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">What's Next?</h3>
          <p style="color: #92400e;">• You'll receive a confirmation email once payment is successful<br>
          • If there's an issue, we'll notify you immediately<br>
          • Your spot is secured while we process the payment</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Thank you for your patience,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Early Bird Confirmation",
    type: "Transactional",
    subject: "Early Bird booking confirmed for {{event_title}}! 🐦",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #ecfdf5; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #059669; margin: 0;">Early Bird Confirmed! 🐦</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>Congratulations! You've secured an early bird spot for <strong>{{event_title}}</strong> and saved money!</p>
        
        <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #166534; margin-top: 0;">Your Early Bird Benefits</h3>
          <ul style="color: #166534;">
            <li>✅ Guaranteed spot at this popular event</li>
            <li>💰 Special early bird pricing</li>
            <li>⭐ Priority access to future events from this host</li>
          </ul>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Event Details</h3>
          <p><strong>Event:</strong> {{event_title}}<br>
          <strong>Date:</strong> {{event_date}}<br>
          <strong>Time:</strong> {{event_time}}<br>
          <strong>Location:</strong> {{event_location}}<br>
          <strong>Booking Reference:</strong> {{booking_ref}}</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          See you there!<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Waitlist Confirmation",
    type: "Transactional",
    subject: "You're on the waitlist for {{event_title}}",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #fef3c7; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #d97706; margin: 0;">You're on the Waitlist!</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p><strong>{{event_title}}</strong> is currently full, but we've added you to the waitlist. If a spot opens up, you'll be the first to know!</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">How the Waitlist Works</h3>
          <p style="color: #92400e;">• We'll notify you immediately if a spot becomes available<br>
          • You'll have 30 minutes to confirm your booking<br>
          • No payment required until a spot opens up</p>
        </div>
        
        <p>Keep an eye on your email - popular events often have last-minute cancellations!</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Keeping our fingers crossed,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Waitlist Spot Available",
    type: "Automated",
    subject: "🎉 A spot opened up for {{event_title}}!",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #ecfdf5; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #059669; margin: 0;">Great News! 🎉</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>A spot just opened up for <strong>{{event_title}}</strong>! You have <strong>30 minutes</strong> to claim your spot.</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="color: #dc2626; margin-top: 0;">⏰ Time Sensitive!</h3>
          <p style="color: #991b1b;">This offer expires in 30 minutes. After that, the spot will go to the next person on the waitlist.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Claim Your Spot Now</a>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Event Details</h3>
          <p><strong>Event:</strong> {{event_title}}<br>
          <strong>Date:</strong> {{event_date}}<br>
          <strong>Time:</strong> {{event_time}}<br>
          <strong>Price:</strong> {{total_amount}}</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Don't miss out!<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Event Update Notification",
    type: "Automated",
    subject: "Important update for {{event_title}}",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #fef3c7; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #d97706; margin: 0;">Event Update 📝</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>{{host_name}} has made an important update to your upcoming event <strong>{{event_title}}</strong>.</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin-top: 0;">What's Changed</h3>
          <p style="color: #92400e;">Please check your booking details for the most up-to-date information about this event.</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Current Event Details</h3>
          <p><strong>Event:</strong> {{event_title}}<br>
          <strong>Date:</strong> {{event_date}}<br>
          <strong>Time:</strong> {{event_time}}<br>
          <strong>Location:</strong> {{event_location}}<br>
          <strong>Booking Reference:</strong> {{booking_ref}}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Updated Details</a>
        </div>
        
        <p>If you have any questions about these changes, please contact {{host_name}} directly.</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Event Cancellation by Host",
    type: "Transactional",
    subject: "{{event_title}} has been cancelled - Full refund processed",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #fef2f2; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #dc2626; margin: 0;">Event Cancelled</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>We're sorry to inform you that <strong>{{event_title}}</strong> scheduled for {{event_date}} has been cancelled by the host.</p>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">💰 Full Refund Processed</h3>
          <p style="color: #065f46;">We've automatically processed a full refund of {{total_amount}} to your original payment method. It may take 3-5 business days to appear in your account.</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Cancelled Event Details</h3>
          <p><strong>Event:</strong> {{event_title}}<br>
          <strong>Host:</strong> {{host_name}}<br>
          <strong>Original Date:</strong> {{event_date}}<br>
          <strong>Booking Reference:</strong> {{booking_ref}}<br>
          <strong>Refund Amount:</strong> {{total_amount}}</p>
        </div>
        
        <p>We understand this is disappointing. Would you like us to notify you about similar events?</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Find Similar Events</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Our sincere apologies,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Booking Cancellation Confirmation",
    type: "Transactional",
    subject: "Booking cancelled for {{event_title}}",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #374151; margin: 0;">Booking Cancelled</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>Your booking for <strong>{{event_title}}</strong> has been successfully cancelled.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Cancelled Booking Details</h3>
          <p><strong>Event:</strong> {{event_title}}<br>
          <strong>Date:</strong> {{event_date}}<br>
          <strong>Booking Reference:</strong> {{booking_ref}}<br>
          <strong>Cancellation Date:</strong> Today</p>
        </div>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">💰 Refund Information</h3>
          <p style="color: #065f46;">Your refund of {{total_amount}} has been processed according to our cancellation policy. It will appear in your account within 3-5 business days.</p>
        </div>
        
        <p>We're sorry to see you go! We hope you'll find another amazing experience to book with us soon.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Browse Other Events</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Hope to see you again soon,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Refund Processed",
    type: "Transactional",
    subject: "Refund processed for {{event_title}}",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #ecfdf5; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #059669; margin: 0;">Refund Processed ✅</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>Your refund for <strong>{{event_title}}</strong> has been successfully processed.</p>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">💰 Refund Details</h3>
          <p style="color: #065f46;"><strong>Amount:</strong> {{total_amount}}<br>
          <strong>Refund Method:</strong> Original payment method<br>
          <strong>Processing Time:</strong> 3-5 business days<br>
          <strong>Reference:</strong> {{booking_ref}}</p>
        </div>
        
        <p>The refund will appear in your account within 3-5 business days. If you don't see it after this time, please contact your bank or payment provider.</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Thank you for using Provaa,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Event Reminder - 7 Days",
    type: "Automated",
    subject: "{{event_title}} is coming up next week! 📅",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #ecfdf5; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #059669; margin: 0;">One Week to Go! 📅</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>Your culinary adventure <strong>{{event_title}}</strong> is just one week away! We're getting excited, and we hope you are too.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Event Details</h3>
          <p><strong>Event:</strong> {{event_title}}<br>
          <strong>Date:</strong> {{event_date}}<br>
          <strong>Time:</strong> {{event_time}}<br>
          <strong>Location:</strong> {{event_location}}<br>
          <strong>Host:</strong> {{host_name}}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">💡 Getting Ready</h3>
          <p style="color: #92400e;">• Double-check the location and arrival time<br>
          • Let us know about any dietary restrictions<br>
          • Bring your appetite and enthusiasm!<br>
          • Check the weather for outdoor events</p>
        </div>
        
        <p>We'll send you another reminder the day before with any final details from your host.</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Looking forward to seeing you there,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Event Reminder - 1 Hour",
    type: "Automated",
    subject: "{{event_title}} starts in 1 hour! 🕐",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #fef3c7; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #d97706; margin: 0;">Starting in 1 Hour! 🕐</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p><strong>{{event_title}}</strong> starts in just 1 hour! Time to head over to the location.</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="color: #dc2626; margin-top: 0;">🏃‍♂️ Time to Go!</h3>
          <p style="color: #991b1b;"><strong>Location:</strong> {{event_location}}<br>
          <strong>Start Time:</strong> {{event_time}}<br>
          <strong>Your Host:</strong> {{host_name}}</p>
        </div>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">📱 Last Minute Checklist</h3>
          <p style="color: #065f46;">✅ Double-check the address<br>
          ✅ Bring your booking reference: {{booking_ref}}<br>
          ✅ Arrive 5-10 minutes early<br>
          ✅ Contact your host if you're running late</p>
        </div>
        
        <p>Have an amazing time!</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Enjoy your experience,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Final Check-in Instructions",
    type: "Automated",
    subject: "Final details for {{event_title}} - Check-in info inside",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #ecfdf5; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #059669; margin: 0;">Final Event Details 📋</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>{{host_name}} has shared some final details for <strong>{{event_title}}</strong> tomorrow!</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📍 Check-in Information</h3>
          <p><strong>Location:</strong> {{event_location}}<br>
          <strong>Time:</strong> {{event_time}}<br>
          <strong>Booking Reference:</strong> {{booking_ref}}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">💡 Important Notes</h3>
          <p style="color: #92400e;">• Please arrive 10 minutes early for check-in<br>
          • Bring a valid ID and your booking reference<br>
          • Contact {{host_name}} directly if you're running late<br>
          • Look forward to meeting your fellow food enthusiasts!</p>
        </div>
        
        <p>If you have any last-minute questions, don't hesitate to reach out to your host or our support team.</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          See you tomorrow!<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Thank You Email",
    type: "Automated",
    subject: "Thank you for joining {{event_title}}! 🙏",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #ecfdf5; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #059669; margin: 0;">Thank You! 🙏</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>Thank you for joining <strong>{{event_title}}</strong>! We hope you had an absolutely amazing time with {{host_name}} and the other guests.</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">🌟 Share Your Experience</h3>
          <p style="color: #92400e;">Your feedback helps other food lovers discover amazing experiences. Would you like to leave a review?</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">Leave a Review</a>
          <a href="#" style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Share Photos</a>
        </div>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">🔍 Discover More</h3>
          <p style="color: #065f46;">Loved this experience? Check out similar events or follow {{host_name}} to be notified about their future events!</p>
        </div>
        
        <p>Thank you for being part of the Provaa community. We can't wait to see you at your next culinary adventure!</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          With gratitude,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Review Request",
    type: "Automated",
    subject: "How was {{event_title}}? Share your experience ⭐",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #fef3c7; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #d97706; margin: 0;">How Was Your Experience? ⭐</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>We hope you loved <strong>{{event_title}}</strong> with {{host_name}}! Your experience matters to us and helps other food enthusiasts discover amazing events.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 18px; color: #374151; margin-bottom: 20px;">Rate your experience:</p>
          <div style="font-size: 24px; margin-bottom: 20px;">⭐⭐⭐⭐⭐</div>
          <a href="#" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Leave a Review</a>
        </div>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">💡 Why Reviews Matter</h3>
          <p style="color: #065f46;">• Help other food lovers find great experiences<br>
          • Give valuable feedback to hosts<br>
          • Build a stronger community of culinary enthusiasts<br>
          • Share your favorite moments and recommendations</p>
        </div>
        
        <p>It only takes a minute, but your review can help someone discover their next favorite culinary experience!</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Thank you for your time,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Event Photos & Recap",
    type: "Automated",
    subject: "Photos from {{event_title}} are here! 📸",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #ecfdf5; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #059669; margin: 0;">Event Photos & Memories 📸</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>The photos from <strong>{{event_title}}</strong> are ready! Relive those amazing moments and share your favorites with friends.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Event Photos</a>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📱 Share the Love</h3>
          <p>• Download your favorite photos<br>
          • Tag us on social media @provaa<br>
          • Share with your fellow attendees<br>
          • Show friends what they missed!</p>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">🎯 Did You Know?</h3>
          <p style="color: #92400e;">{{host_name}} has more amazing events coming up! Follow them to be the first to know about new experiences.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Follow {{host_name}}</a>
        </div>
        
        <p>Thank you for making this event special!</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Capturing memories,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  },
  {
    name: "Next Event Suggestions",
    type: "Automated",
    subject: "Loved {{event_title}}? You'll love these too! 🍽️",
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: #ecfdf5; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #059669; margin: 0;">More Amazing Experiences 🍽️</h1>
        </div>
        
        <p>Hi {{user_name}},</p>
        
        <p>We're so glad you enjoyed <strong>{{event_title}}</strong>! Based on your interests, we've found some other amazing culinary experiences you might love.</p>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">🔥 Trending Now</h3>
          <p style="color: #92400e;">• Wine tasting workshops<br>
          • Authentic pasta making classes<br>
          • Street food tours<br>
          • Seasonal cooking experiences</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Browse Similar Events</a>
        </div>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">💝 Exclusive Offer</h3>
          <p style="color: #065f46;">As a returning guest, enjoy 10% off your next booking with code FOODLOVER10!</p>
        </div>
        
        <p>Can't wait to see you at your next culinary adventure!</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Happy exploring,<br>
          The Provaa Team
        </p>
      </div>
    `,
    status: "Active"
  }
];

export const templateCreationService = {
  async createTemplatesDirectly(): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      console.log('🔧 Creating templates directly via database...');
      console.log(`🔧 Inserting ${emailTemplateDefinitions.length} templates`);

      // Insert templates in batches to avoid timeout
      const batchSize = 5;
      let insertedCount = 0;

      for (let i = 0; i < emailTemplateDefinitions.length; i += batchSize) {
        const batch = emailTemplateDefinitions.slice(i, i + batchSize);
        
        const { data, error } = await supabase
          .from('email_templates')
          .insert(batch)
          .select();

        if (error) {
          console.error(`❌ Database insert error for batch ${Math.floor(i / batchSize) + 1}:`, error);
          throw error;
        }

        insertedCount += batch.length;
        console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${insertedCount}/${emailTemplateDefinitions.length} templates`);
      }

      console.log(`✅ Successfully created ${insertedCount} templates directly`);
      return { success: true, count: insertedCount };

    } catch (error: any) {
      console.error('❌ Error creating templates directly:', error);
      return { success: false, count: 0, error: error.message };
    }
  },

  async tryEdgeFunction(): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      console.log('🚀 Attempting edge function creation...');

      const { data, error } = await supabase.functions.invoke('create-email-templates', {
        body: { force: true }
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        return { success: false, error: error.message };
      }

      if (data?.error) {
        console.error('❌ Edge function data error:', data.error);
        return { success: false, error: data.error };
      }

      console.log('✅ Edge function succeeded:', data);
      return { success: true, count: data?.templatesCreated || 0 };

    } catch (error: any) {
      console.error('❌ Edge function catch error:', error);
      return { success: false, error: error.message };
    }
  }
};
