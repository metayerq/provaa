
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Users, Calendar } from 'lucide-react';

interface TestResultData {
  type: string;
  mode?: string;
  bookingRef?: string;
  eventTitle?: string;
  eventDate?: string;
  eventDetails?: string;
  response?: any;
  simulationNote?: string;
  error?: any;
}

interface TestResult {
  id: number;
  type: string;
  timestamp: string;
  success: boolean;
  data: TestResultData;
}

interface TestResultItemProps {
  result: TestResult;
}

export const TestResultItem: React.FC<TestResultItemProps> = ({ result }) => {
  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (success: boolean, mode?: string) => {
    if (!success) {
      return (
        <Badge variant="destructive">
          Failed
        </Badge>
      );
    }

    if (mode === 'real') {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Real Test
        </Badge>
      );
    } else if (mode === 'simulation') {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
          Simulation
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Success
      </Badge>
    );
  };

  const getModeIcon = (mode: string) => {
    if (mode === 'real') {
      return <Users className="h-3 w-3" />;
    } else if (mode === 'simulation') {
      return <Calendar className="h-3 w-3" />;
    }
    return null;
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon(result.success)}
          <span className="font-medium capitalize">{result.type} Email Test</span>
          {getStatusBadge(result.success, result.data.mode)}
          {result.data.mode && getModeIcon(result.data.mode)}
        </div>
        <span className="text-sm text-gray-500">{result.timestamp}</span>
      </div>
      
      {result.data.error ? (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {typeof result.data.error === 'string' ? result.data.error : 'Error occurred during test'}
        </div>
      ) : (
        <div className="text-sm space-y-1">
          {result.data.bookingRef && (
            <p><strong>Booking:</strong> {result.data.bookingRef}</p>
          )}
          {result.data.eventTitle && (
            <p><strong>Event:</strong> {result.data.eventTitle}</p>
          )}
          {result.data.eventDate && (
            <p><strong>Date:</strong> {result.data.eventDate}</p>
          )}
          {result.data.eventDetails && (
            <p><strong>Details:</strong> {result.data.eventDetails}</p>
          )}
          {result.data.response && (
            <div className={`p-2 rounded ${result.data.mode === 'simulation' ? 'bg-blue-50' : 'bg-green-50'}`}>
              <p className={`font-medium ${result.data.mode === 'simulation' ? 'text-blue-800' : 'text-green-800'}`}>
                {result.data.mode === 'simulation' ? 
                  `🧪 ${result.data.response.message}` :
                  `✅ ${result.data.response.sent || 0} emails sent`
                }
                {result.data.response.failed > 0 && ` (${result.data.response.failed} failed)`}
              </p>
            </div>
          )}
          {result.data.simulationNote && (
            <div className="bg-yellow-50 p-2 rounded text-yellow-800 text-xs">
              <p><strong>Note:</strong> {result.data.simulationNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
