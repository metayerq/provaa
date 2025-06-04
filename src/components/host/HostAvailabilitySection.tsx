
import React from 'react';
import { Clock, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useHostFrequency } from '@/hooks/useHostFrequency';
import { useHostFollow } from '@/hooks/useHostFollow';
import { HostFollowButton } from './HostFollowButton';
import { HostFrequencyBadge } from './HostFrequencyBadge';
import { 
  formatHostingFrequency, 
  formatLastEventDate, 
  getUrgencyMessage 
} from '@/utils/hostFrequencyUtils';

interface HostAvailabilitySectionProps {
  hostId: string;
  hostName: string;
}

export const HostAvailabilitySection: React.FC<HostAvailabilitySectionProps> = ({
  hostId,
  hostName
}) => {
  const { frequencyData, isLoading } = useHostFrequency(hostId);
  const { followerCount } = useHostFollow(hostId);

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!frequencyData) return null;

  const urgencyMessage = getUrgencyMessage(
    frequencyData.average_frequency_days,
    frequencyData.last_event_date
  );

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📊 {hostName}'s Hosting Pattern
        </h3>
        <HostFrequencyBadge 
          averageFrequencyDays={frequencyData.average_frequency_days} 
          size="sm"
        />
      </div>
      
      <div className="border-t border-gray-200 mb-4"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center text-gray-700">
          <Clock className="h-5 w-5 mr-3 text-emerald-600" />
          <div>
            <div className="text-sm text-gray-500">Hosts every</div>
            <div className="font-medium">
              {formatHostingFrequency(frequencyData.average_frequency_days)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center text-gray-700">
          <TrendingUp className="h-5 w-5 mr-3 text-emerald-600" />
          <div>
            <div className="text-sm text-gray-500">Events per year</div>
            <div className="font-medium">
              {frequencyData.events_per_year || 'New host'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center text-gray-700">
          <Calendar className="h-5 w-5 mr-3 text-emerald-600" />
          <div>
            <div className="text-sm text-gray-500">Last event</div>
            <div className="font-medium">
              {formatLastEventDate(frequencyData.last_event_date)}
            </div>
          </div>
        </div>
      </div>

      {urgencyMessage && (
        <Alert className="mb-4 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            {urgencyMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Join {followerCount} others waiting for {hostName}'s next event
        </div>
        <HostFollowButton 
          hostId={hostId} 
          showFollowerCount={false}
          className="ml-4"
        />
      </div>
    </div>
  );
};
