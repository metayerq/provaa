import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch user's favorites on mount
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites(new Set());
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('event_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const favoriteIds = new Set(data.map(fav => fav.event_id));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save events to your favorites.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const wasAlreadyFavorited = favorites.has(eventId);

    // Optimistic update - immediately update the UI
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (wasAlreadyFavorited) {
        newFavorites.delete(eventId);
      } else {
        newFavorites.add(eventId);
      }
      return newFavorites;
    });

    // Show appropriate toast message immediately
    const toastMessage = wasAlreadyFavorited 
      ? { title: "Removed from favorites", description: "Event removed from your saved list." }
      : { title: "Added to favorites", description: "Event saved to your favorites!" };

    toast(toastMessage);

    try {
      if (wasAlreadyFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', eventId);

        if (error) throw error;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            event_id: eventId
          });

        if (error) throw error;
      }

      // Invalidate saved events query to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['saved-events', user.id] });

    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      
      // Revert optimistic update on error
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (wasAlreadyFavorited) {
          newFavorites.add(eventId); // Add back if removal failed
        } else {
          newFavorites.delete(eventId); // Remove if addition failed
        }
        return newFavorites;
      });

      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isFavorited = (eventId: string) => favorites.has(eventId);

  return {
    favorites,
    toggleFavorite,
    isFavorited,
    loading
  };
};
