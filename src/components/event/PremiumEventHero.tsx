
import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PremiumEventHeroProps {
  image?: string;
  title: string;
  category: string;
  categoryInfo?: {
    emoji?: string;
    label?: string;
  };
  host: {
    name: string;
    rating: number;
  };
  location: {
    city: string;
  };
}

export const PremiumEventHero: React.FC<PremiumEventHeroProps> = ({
  image,
  title,
  category,
  categoryInfo,
  host,
  location
}) => {
  return (
    <section className="relative">
      <div className="h-[500px] w-full bg-emerald-100 overflow-hidden">
        {image ? (
          <img
            src={`${image}?auto=format&fit=crop&w=2000&h=500`}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {categoryInfo?.emoji || '🍽️'}
          </div>
        )}
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)'
          }}
        />
        
        {/* Content overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="max-w-7xl mx-auto">
            {/* Category badges */}
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                <span className="mr-1">{categoryInfo?.emoji || '🍽️'}</span>
                {categoryInfo?.label || category}
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                🌱 Locally Sourced
              </Badge>
            </div>
            
            {/* Event title */}
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight font-serif">
              {title}
            </h1>
            
            {/* Host info line */}
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <span className="text-lg">
                Hosted by <span className="font-semibold">{host.name}</span>
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{host.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{location.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
