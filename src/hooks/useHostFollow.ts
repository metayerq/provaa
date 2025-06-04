
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useHostFollow = (hostId: string) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !hostId) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user is following this host
        const { data: followData, error: followError } = await supabase
          .from('host_follows')
          .select('id')
          .eq('user_id', user.id)
          .eq('host_id', hostId)
          .maybeSingle();

        if (followError) throw followError;

        setIsFollowing(!!followData);

        // Get follower count
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('follower_count')
          .eq('id', hostId)
          .single();

        if (profileError) throw profileError;

        setFollowerCount(profileData.follower_count || 0);
      } catch (error) {
        console.error('Error checking follow status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFollowStatus();
  }, [user, hostId]);

  const toggleFollow = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow hosts",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('host_follows')
          .delete()
          .eq('user_id', user.id)
          .eq('host_id', hostId);

        if (error) throw error;

        // Update follower count
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            follower_count: Math.max(0, followerCount - 1)
          })
          .eq('id', hostId);

        if (updateError) throw updateError;

        setIsFollowing(false);
        setFollowerCount(prev => Math.max(0, prev - 1));
        
        toast({
          title: "Unfollowed",
          description: "You will no longer receive notifications from this host"
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('host_follows')
          .insert({ user_id: user.id, host_id: hostId });

        if (error) throw error;

        // Update follower count
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            follower_count: followerCount + 1
          })
          .eq('id', hostId);

        if (updateError) throw updateError;

        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        
        toast({
          title: "Following!",
          description: "You'll be notified when this host creates new events"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    }
  };

  return {
    isFollowing,
    isLoading,
    followerCount,
    toggleFollow
  };
};
