import React, { useState } from 'react';
import { Heart, X, Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event, Product } from '@/utils/mockData';
import EventCard from '@/components/EventCard';
import { useToast } from '@/hooks/use-toast';

const SavedEvents = () => {
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch saved events
  const { data: savedEvents = [], isLoading } = useQuery({
    queryKey: ['saved-events', user?.id],
    queryFn: async () => {
      if (!user || favorites.size === 0) return [];
      
      const favoriteIds = Array.from(favorites);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .in('id', favoriteIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform to Event format with proper location handling
      return data.map(event => {
        // Handle location type conversion
        let location: Event['location'] = { address: '', city: 'Unknown', venue: 'Unknown' };
        if (event.location && typeof event.location === 'object' && !Array.isArray(event.location)) {
          const loc = event.location as any;
          location = {
            address: loc.address || '',
            city: loc.city || 'Unknown',
            venue: loc.venue || loc.venueName || loc.venue_name || 'Unknown Venue',
            coordinates: loc.coordinates
          };
        } else {
          location = {
            address: 'Unknown Address',
            city: 'Unknown City',
            venue: 'Unknown Venue'
          };
        }

        // Enhanced products data parsing with better validation
        let productsData: Product[] = [];
        
        if (Array.isArray(event.products)) {
          productsData = event.products
            .map((product: any, index: number) => {
              if (typeof product === 'object' && product !== null && product.name && product.name.trim() !== '') {
                return {
                  id: product.id || `product-${index}`,
                  name: product.name.trim(),
                  description: product.description || '',
                  image: product.image,
                  producer: product.producer,
                  year: product.year,
                  type: product.type
                };
              }
              return null;
            })
            .filter(product => product !== null) as Product[];
        }

        return {
          id: event.id,
          title: event.title,
          description: event.description || '',
          category: event.category || '',
          date: event.date,
          time: event.time,
          duration: event.duration || '',
          location,
          price: Number(event.price),
          capacity: event.capacity,
          spotsLeft: event.spots_left,
          products: productsData,
          host: {
            id: event.host_id || '',
            name: 'Host',
            bio: '',
            rating: 4.9,
            events: 0,
            image: undefined,
          },
          image: event.image,
          featured: false,
        } as Event;
      });
    },
    enabled: !!user && favorites.size > 0,
  });

  // Optimistic remove mutation
  const removeMutation = useMutation({
    mutationFn: async (eventId: string) => {
      await toggleFavorite(eventId);
    },
    onMutate: async (eventId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['saved-events', user?.id] });

      // Snapshot the previous value
      const previousEvents = queryClient.getQueryData(['saved-events', user?.id]);

      // Optimistically update to remove the event immediately
      queryClient.setQueryData(['saved-events', user?.id], (old: Event[] | undefined) => {
        return old ? old.filter(event => event.id !== eventId) : [];
      });

      // Show immediate feedback
      toast({
        title: "Removed from favorites",
        description: "Event removed from your saved list.",
      });

      // Return context object with the snapshot
      return { previousEvents };
    },
    onError: (error, eventId, context) => {
      // Revert the optimistic update
      queryClient.setQueryData(['saved-events', user?.id], context?.previousEvents);
      
      toast({
        title: "Error",
        description: "Failed to remove event. Please try again.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['saved-events', user?.id] });
    },
  });

  // Filter events based on search
  const filteredEvents = savedEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveEvent = (eventId: string) => {
    removeMutation.mutate(eventId);
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign in to view saved events</h1>
          <p className="text-gray-600 mb-6">Create an account to save your favorite experiences</p>
          <Button onClick={() => window.location.href = '/auth/signin'}>
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Saved Events</h1>
          <p className="text-gray-600">
            {savedEvents.length} saved experience{savedEvents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Search */}
        {savedEvents.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search saved events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-64">
            <div className="text-lg text-gray-600">Loading saved events...</div>
          </div>
        ) : savedEvents.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No saved experiences yet</h2>
            <p className="text-gray-600 mb-6">Start exploring to discover amazing experiences!</p>
            <Button onClick={() => window.location.href = '/events'}>
              Explore Events
            </Button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No events match your search</h2>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="relative">
                {/* Remove button */}
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveEvent(event.id)}
                    disabled={removeMutation.isPending}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    {removeMutation.isPending && removeMutation.variables === event.id ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SavedEvents;
