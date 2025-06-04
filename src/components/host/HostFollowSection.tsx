
import React from 'react';
import { HostFollowButton } from './HostFollowButton';

interface HostFollowSectionProps {
  hostId: string;
  hostName: string;
  followerCount: number;
}

export const HostFollowSection: React.FC<HostFollowSectionProps> = ({
  hostId,
  hostName,
  followerCount
}) => {
  // Format follower text correctly
  const getFollowerText = (count: number) => {
    if (count === 0) return "Be the first to follow";
    if (count === 1) return "Join 1 person following";
    return `Join ${count} people following`;
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-gray-700">
          {getFollowerText(followerCount)} {hostName.split(' ')[0]}
        </p>
        <HostFollowButton 
          hostId={hostId}
          variant="default"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        />
      </div>
    </div>
  );
};
