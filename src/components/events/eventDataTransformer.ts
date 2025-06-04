
import { Event } from '@/utils/mockData';

export const transformSupabaseEventData = (eventsData: any[], hostProfilesMap: Map<string, any>): Event[] => {
  return eventsData
    .map((eventData) => {
      try {
        // Get host profile data
        const hostProfile = hostProfilesMap.get(eventData.host_id);
        
        // Enhanced host data with actual profile information
        const hostData = {
          id: eventData.host_id || '',
          name: hostProfile?.full_name || 'Host',
          bio: hostProfile?.bio || '',
          rating: hostProfile?.rating || null, // Use actual rating or null
          events: 0, // This would need to be calculated separately if needed
          image: hostProfile?.profile_photo_url || hostProfile?.avatar_url,
          credentials: '',
          host_story: ''
        };

        // Enhanced location data parsing with better venue extraction
        let locationData;
        if (typeof eventData.location === 'object' && eventData.location !== null) {
          locationData = eventData.location as any;
        } else {
          locationData = {
            address: 'Unknown Address',
            city: 'Unknown City',
            venue: 'Unknown Venue'
          };
        }

        // Enhanced products data parsing
        let productsData: any[] = [];
        if (Array.isArray(eventData.products)) {
          productsData = eventData.products
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
            .filter(product => product !== null);
        }

        const transformedEvent: Event = {
          id: eventData.id,
          title: eventData.title,
          description: eventData.description || '',
          category: eventData.category || '',
          date: eventData.date,
          time: eventData.time,
          duration: eventData.duration || '',
          location: {
            address: locationData.address || 'Unknown Address',
            city: locationData.city || 'Unknown City',
            // Try multiple possible venue field names
            venue: locationData.venue || locationData.venueName || locationData.venue_name || 'Unknown Venue',
            coordinates: locationData.coordinates
          },
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
          languagesSpoken: []
        };

        return transformedEvent;
      } catch (error) {
        console.error('Error transforming event:', eventData.id, error);
        return null;
      }
    })
    .filter(event => event !== null) as Event[];
};
