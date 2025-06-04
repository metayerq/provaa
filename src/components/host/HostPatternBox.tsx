
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HostFrequencyBadge } from './HostFrequencyBadge';
import { HostFollowButton } from './HostFollowButton';
import { HostRatingDisplay } from './HostRatingDisplay';
import { useHostFrequency } from '@/hooks/useHostFrequency';
import { useHostFollow } from '@/hooks/useHostFollow';
import { formatHostingFrequency, formatLastEventDate } from '@/utils/hostFrequencyUtils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface HostPatternBoxProps {
  hostId: string;
  hostName: string;
}

export const HostPatternBox: React.FC<HostPatternBoxProps> = ({
  hostId,
  hostName
}) => {
  const { frequencyData, isLoading } = useHostFrequency(hostId);
  const { followerCount } = useHostFollow(hostId);

  // Fetch host rating data
  const { data: hostProfile } = useQuery({
    queryKey: ['host-profile', hostId],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('rating, review_count')
        .eq('id', hostId)
        .single();
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-gray-50 border-0">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-50 border-0 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-lg">📊</span>
            <h3 className="font-semibold text-gray-900">{hostName}'s Hosting Pattern</h3>
          </div>
          <div className="flex items-center gap-3">
            <HostRatingDisplay 
              rating={hostProfile?.rating || null}
              reviewCount={hostProfile?.review_count || 0}
              size="sm"
              showEmptyState={true}
            />
            <HostFrequencyBadge 
              averageFrequencyDays={frequencyData?.average_frequency_days || null}
              size="sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Hosts every</div>
            <div className="font-medium text-gray-900">
              {formatHostingFrequency(frequencyData?.average_frequency_days || null)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Events per year</div>
            <div className="font-medium text-gray-900">
              {frequencyData?.events_per_year || 'New host'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Last event</div>
            <div className="font-medium text-gray-900">
              {formatLastEventDate(frequencyData?.last_event_date || null)}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Join {followerCount || 0} others following {hostName}
            </span>
            <HostFollowButton 
              hostId={hostId}
              variant="outline"
              size="sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
