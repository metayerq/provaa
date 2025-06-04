
import React, { useEffect, useRef } from 'react';
import EventCard from '@/components/EventCard';
import { Event } from '@/utils/mockData';

interface SimilarEventsProps {
  events: Event[];
}

export const SimilarEvents: React.FC<SimilarEventsProps> = ({ events }) => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const cards = sectionRef.current?.querySelectorAll('.event-card-wrapper');
          cards?.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('visible');
            }, index * 150);
          });
        }
      },
      {
        threshold: 0.2,
      }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  if (events.length === 0) return null;
  
  return (
    <section 
      ref={sectionRef}
      className="max-w-7xl mx-auto px-4 py-16 bg-gray-50"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Similar Experiences You Might Like</h2>
      <p className="text-gray-600 mb-8">Discover more culinary adventures that match your taste</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.map((event, index) => (
          <div 
            key={event.id} 
            className="event-card-wrapper opacity-0 transform translate-y-8 transition-all duration-500" 
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  );
};
