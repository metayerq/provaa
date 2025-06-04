
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellRing, Users } from 'lucide-react';
import { useHostFollow } from '@/hooks/useHostFollow';

interface HostFollowButtonProps {
  hostId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showFollowerCount?: boolean;
  className?: string;
}

export const HostFollowButton: React.FC<HostFollowButtonProps> = ({
  hostId,
  variant = 'outline',
  size = 'default',
  showFollowerCount = false,
  className = ''
}) => {
  const { isFollowing, isLoading, followerCount, toggleFollow } = useHostFollow(hostId);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={isFollowing ? 'default' : variant}
        size={size}
        onClick={toggleFollow}
        disabled={isLoading}
        className={isFollowing ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
      >
        {isFollowing ? (
          <>
            <BellRing className="h-4 w-4 mr-2" />
            Following
          </>
        ) : (
          <>
            <Bell className="h-4 w-4 mr-2" />
            Follow Host
          </>
        )}
      </Button>
      
      {showFollowerCount && followerCount > 0 && (
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-1" />
          {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
        </div>
      )}
    </div>
  );
};
