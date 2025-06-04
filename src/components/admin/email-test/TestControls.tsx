
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface TestControlsProps {
  isLoading: boolean;
  onTest: (testType: 'confirmation' | 'reminder' | 'update') => void;
}

export const TestControls: React.FC<TestControlsProps> = ({ isLoading, onTest }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email System Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => onTest('confirmation')}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Test Booking Confirmation
          </Button>
          
          <Button
            onClick={() => onTest('reminder')}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
            Test Event Reminders
          </Button>
          
          <Button
            onClick={() => onTest('update')}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-4 w-4" />}
            Test Event Updates
          </Button>
        </div>
        
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <p><strong>How it works:</strong></p>
          <p>• <strong>Booking Confirmation:</strong> Tests with the most recent confirmed booking</p>
          <p>• <strong>Event Reminders:</strong> Tests with upcoming events (real emails if tomorrow, simulation otherwise)</p>
          <p>• <strong>Event Updates:</strong> Tests with upcoming events and existing bookings</p>
          <p className="mt-2 text-xs text-blue-600">
            ⚠️ Please wait 3+ seconds between tests to avoid rate limiting
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
