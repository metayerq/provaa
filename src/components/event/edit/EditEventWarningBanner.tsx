
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface EditEventWarningBannerProps {
  bookingCount: number;
}

const EditEventWarningBanner: React.FC<EditEventWarningBannerProps> = ({
  bookingCount
}) => {
  if (bookingCount === 0) return null;

  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        This event has {bookingCount} confirmed bookings. Any changes will notify attendees via email.
      </AlertDescription>
    </Alert>
  );
};

export default EditEventWarningBanner;
