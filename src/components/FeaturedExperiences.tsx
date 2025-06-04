
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import ExperienceCard from './ExperienceCard';
import { Event } from '@/utils/mockData';

interface DatabaseEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  location: any;
  price: number;
  capacity: number;
  spots_left: number;
  host_id: string;
  image: string;
  category: string;
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  profile_photo_url: string;
}

const FeaturedExperiences = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true })
          .limit(6);

        if (eventsError) throw eventsError;

        if (eventsData && eventsData.length > 0) {
          // Get unique host IDs
          const hostIds = [...new Set(eventsData.map(event => event.host_id).filter(Boolean))];
          
          // Fetch host profiles with both avatar_url and profile_photo_url
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, profile_photo_url')
            .in('id', hostIds);

          if (profilesError) throw profilesError;

          // Create host lookup map
          const hostLookup = (profiles || []).reduce((acc: { [key: string]: Profile }, profile: Profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {});

          // Transform database events to Event interface format
          const transformedEvents: Event[] = eventsData.map((dbEvent: DatabaseEvent) => {
            const hostProfile = hostLookup[dbEvent.host_id];
            return {
              id: dbEvent.id,
              title: dbEvent.title,
              description: dbEvent.description || '',
              category: dbEvent.category || 'other',
              date: dbEvent.date,
              time: dbEvent.time,
              duration: dbEvent.duration || '2 hours',
              location: {
                address: dbEvent.location?.address || 'TBD',
                city: dbEvent.location?.city || 'TBD',
                venue: dbEvent.location?.venue_name || 'TBD'
              },
              price: Number(dbEvent.price),
              capacity: dbEvent.capacity,
              spotsLeft: dbEvent.spots_left,
              host: {
                id: dbEvent.host_id,
                name: hostProfile?.full_name || 'Anonymous Host',
                image: hostProfile?.profile_photo_url || hostProfile?.avatar_url || undefined,
                bio: '',
                rating: 0,
                events: 0
              },
              image: dbEvent.image || undefined,
              products: [],
              featured: false
            };
          });

          setEvents(transformedEvents);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-left text-charcoal mb-8">
            Popular Experiences in Lisbon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-charcoal mb-6">
            Popular Experiences in Lisbon
          </h2>
          <p className="text-gray-600">No experiences available at the moment. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-charcoal mb-4">
            Popular Experiences in Lisbon
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {events.map((event) => (
            <ExperienceCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
              time={event.time}
              location={{
                venue_name: event.location.venue,
                city: event.location.city
              }}
              price={event.price}
              capacity={event.capacity}
              spots_left={event.spotsLeft}
              host_name={event.host.name}
              host_image={event.host.image}
              image={event.image}
              category={event.category}
            />
          ))}
        </div>

        {/* See More Button */}
        <div className="text-center">
          <Link to="/events">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 hover:scale-[1.02] font-medium px-8 py-3"
            >
              See More Experiences
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedExperiences;
