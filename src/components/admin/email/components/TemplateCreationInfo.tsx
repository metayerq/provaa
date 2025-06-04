
import React from 'react';

export const TemplateCreationInfo: React.FC = () => {
  return (
    <>
      <div className="text-sm text-gray-600">
        <p className="mb-3">Create a comprehensive collection of 22 email templates covering:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div>
            <p className="font-medium text-gray-800 mb-1">Pre-Booking:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Welcome Email</li>
              <li>Account Verification</li>
              <li>Password Reset</li>
              <li>Profile Completion</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-800 mb-1">Booking Process:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Payment Failed</li>
              <li>Payment Processing</li>
              <li>Early Bird Confirmation</li>
              <li>Waitlist Management</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-800 mb-1">Event Management:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Event Updates</li>
              <li>Event Cancellation</li>
              <li>Booking Cancellation</li>
              <li>Refund Processing</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-800 mb-1">Post-Event:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Thank You & Reviews</li>
              <li>Event Photos</li>
              <li>Next Event Suggestions</li>
              <li>Host Management</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
        <p><strong>Note:</strong> This will create 22 professional email templates with:</p>
        <p>• Mobile-responsive HTML design</p>
        <p>• Template variables for personalization (user_name, event_title, etc.)</p>
        <p>• Appropriate type settings (Transactional/Automated)</p>
        <p>• Ready-to-use content for all scenarios</p>
      </div>
    </>
  );
};
