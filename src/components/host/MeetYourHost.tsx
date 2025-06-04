
import React from 'react';
import { useHostFrequency } from '@/hooks/useHostFrequency';
import { useHostFollow } from '@/hooks/useHostFollow';
import { useHostProfile } from '@/hooks/useHostProfile';
import { HostHeader } from './HostHeader';
import { HostStats } from './HostStats';
import { HostBio } from './HostBio';
import { HostFollowSection } from './HostFollowSection';

interface Host {
  id: string;
  name: string;
  bio: string;
  rating: number;
  events: number;
  image?: string;
  credentials?: string;
  host_story?: string;
  languagesSpoken?: string[];
}

interface MeetYourHostProps {
  host: Host;
}

export const MeetYourHost: React.FC<MeetYourHostProps> = ({ host }) => {
  const { frequencyData, isLoading: frequencyLoading } = useHostFrequency(host.id);
  const { followerCount } = useHostFollow(host.id);
  const { hostProfile, loading: profileLoading } = useHostProfile(host.id);

  // Calculate completed events (past events only)
  const completedEventsCount = frequencyData?.completed_events_count || 0;
  const hasCompletedEvents = completedEventsCount > 0;

  // Use actual rating and review count from database
  const actualRating = hostProfile?.rating || 0;
  const actualReviewCount = hostProfile?.review_count || 0;

  if (profileLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">Meet Your Host</h2>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">Meet Your Host</h2>
      
      <HostHeader host={host} hasCompletedEvents={hasCompletedEvents} />
      
      <HostStats
        hasCompletedEvents={hasCompletedEvents}
        rating={actualRating}
        actualReviewCount={actualReviewCount}
        completedEventsCount={completedEventsCount}
        languagesSpoken={host.languagesSpoken}
      />

      <HostFollowSection
        hostId={host.id}
        hostName={host.name}
        followerCount={followerCount}
      />
      
      <HostBio hostStory={hostProfile?.host_story || host.host_story} />
    </div>
  );
};
