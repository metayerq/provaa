
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Event, Product } from '@/utils/mockData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EventDetailSkeleton } from '@/components/event/EventDetailSkeleton';
import { EventNotFound } from '@/components/event/EventNotFound';
import { EventDetailContent } from '@/components/event/EventDetailContent';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch event from Supabase
  const fetchEvent = async () => {
    if (!id) return;

    try {
      console.log('Fetching event with ID:', id);
      
      // Fetch event with host profile data
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (eventError) {
        console.error('Supabase error:', eventError);
        throw eventError;
      }

      if (!eventData) {
        console.log('No event found with ID:', id);
        setEvent(null);
        setLoading(false);
        return;
      }

      console.log('Fetched event:', {
        id: eventData.id,
        title: eventData.title,
        image: eventData.image,
        location: eventData.location,
        updatedAt: eventData.updated_at
      });

      // Fetch host profile data
      let hostData = {
        id: eventData.host_id || '',
        name: 'Host',
        bio: '',
        rating: 4.9,
        events: 0,
        image: undefined,
        credentials: '',
        host_story: '',
        languagesSpoken: []
      };

      if (eventData.host_id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, bio, host_story, credentials, avatar_url, languages_spoken')
          .eq('id', eventData.host_id)
          .maybeSingle();

        if (!profileError && profileData) {
          hostData = {
            id: eventData.host_id,
            name: profileData.full_name || 'Host',
            bio: profileData.bio || '',
            rating: 4.9,
            events: 0,
            image: profileData.avatar_url,
            credentials: profileData.credentials || '',
            host_story: profileData.host_story || '',
            languagesSpoken: profileData.languages_spoken || []
          };
        }
      }

      // Transform Supabase data to match Event interface - Fix location mapping
      let locationData;
      if (typeof eventData.location === 'object' && eventData.location !== null) {
        const loc = eventData.location as any;
        console.log('Processing location data:', loc);
        locationData = {
          address: loc.address || 'Unknown Address',
          city: loc.city || 'Unknown City',
          // Handle multiple possible venue field names from database
          venue: loc.venue || loc.venueName || loc.venue_name || 'Unknown Venue',
          coordinates: loc.coordinates
        };
      } else {
        locationData = {
          address: 'Unknown Address',
          city: 'Unknown City',
          venue: 'Unknown Venue'
        };
      }

      console.log('Transformed location:', locationData);

      // Enhanced products data parsing with better validation
      let productsData: Product[] = [];
      console.log('Raw products data:', eventData.products);
      
      if (Array.isArray(eventData.products)) {
        productsData = eventData.products
          .map((product: any, index: number) => {
            console.log(`Processing product ${index}:`, product);
            
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
      
      console.log('Processed products:', productsData);

      const transformedEvent: Event = {
        id: eventData.id,
        title: eventData.title,
        description: eventData.description || '',
        category: eventData.category || '',
        date: eventData.date,
        time: eventData.time,
        duration: eventData.duration || '',
        location: locationData,
        price: Number(eventData.price),
        capacity: eventData.capacity,
        spotsLeft: eventData.spots_left,
        products: productsData,
        host: hostData,
        image: eventData.image,
        featured: false,
        // Enhanced fields
        ambianceDescription: eventData.ambiance_description,
        accessibilityInfo: eventData.accessibility_info,
        dressCode: eventData.dress_code,
        dietaryOptions: eventData.dietary_options || [],
        meetingPointDetails: eventData.meeting_point_details,
        cancellationPolicy: eventData.cancellation_policy,
        foodPairings: eventData.food_pairings,
        languagesSpoken: hostData.languagesSpoken || []
      };

      setEvent(transformedEvent);
    } catch (error: any) {
      console.error('Error fetching event:', error);
      toast({
        title: "Error Loading Event",
        description: "There was an error loading the event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id, toast]);

  // Set up real-time subscription to listen for event updates
  useEffect(() => {
    if (!id) return;

    console.log('Setting up real-time subscription for event:', id);

    const channel = supabase
      .channel('event-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'events',
          filter: `id=eq.${id}`
        },
        (payload) => {
          console.log('Real-time event update received:', payload);
          // Refetch the event data when it's updated
          fetchEvent();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [id]);

  if (loading) {
    return <EventDetailSkeleton />;
  }
  
  if (!event) {
    return <EventNotFound />;
  }

  return <EventDetailContent event={event} />;
};

export default EventDetail;
