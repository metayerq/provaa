import React from 'react';
import { Star, MapPin, Calendar, Clock, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HostRatingDisplay } from '@/components/host/HostRatingDisplay';
import { useHostProfile } from '@/hooks/useHostProfile';
import { formatPriceWithPerPerson } from '@/utils/priceUtils';

interface SidePictureEventHeroProps {
  image?: string;
  title: string;
  category: string;
  categoryInfo?: {
    emoji?: string;
    label?: string;
  };
  host: {
    id: string;
    name: string;
    rating: number;
  };
  location: {
    city: string;
  };
  date: string;
  time: string;
  duration?: string;
  capacity: number;
  spotsLeft: number;
  price: number;
}

export const SidePictureEventHero: React.FC<SidePictureEventHeroProps> = ({
  image,
  title,
  category,
  categoryInfo,
  host,
  location,
  date,
  time,
  duration,
  capacity,
  spotsLeft,
  price
}) => {
  const { hostProfile, loading: hostLoading } = useHostProfile(host.id);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Add cache busting for updated images
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return imageUrl;
    
    // Add timestamp to bust cache for Supabase storage URLs
    if (imageUrl.includes('supabase')) {
      const separator = imageUrl.includes('?') ? '&' : '?';
      return `${imageUrl}${separator}t=${Date.now()}`;
    }
    
    return imageUrl;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left side - Event Information */}
        <div className="space-y-6">
          {/* Category badges */}
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
              <span className="mr-1">{categoryInfo?.emoji || '🍽️'}</span>
              {categoryInfo?.label || category}
            </Badge>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              🌱 Locally Sourced
            </Badge>
          </div>

          {/* Event title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight font-serif">
            {title}
          </h1>

          {/* Host info */}
          <div className="flex items-center gap-3">
            <span className="text-lg text-gray-700">
              Hosted by <span className="font-semibold text-gray-900">{host.name}</span>
            </span>
            {!hostLoading && (
              <HostRatingDisplay 
                rating={hostProfile?.rating || null}
                reviewCount={hostProfile?.review_count || 0}
                size="md"
                showNewHostBadge={true}
              />
            )}
          </div>

          {/* Event details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">{formatDate(date)}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700">
              <Clock className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">{time}{duration && ` (${duration})`}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">{location.city}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700">
              <Users className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">{spotsLeft} of {capacity} spots available</span>
            </div>
          </div>

          {/* Price */}
          <div className="pt-4">
            <div className="text-3xl font-bold text-gray-900">
              {formatPriceWithPerPerson(price)}
            </div>
          </div>
        </div>

        {/* Right side - Event Image */}
        <div className="lg:order-last order-first">
          <div className="aspect-[4/3] w-full rounded-xl overflow-hidden shadow-lg">
            {image ? (
              <img
                src={getImageUrl(image)}
                alt={title}
                className="w-full h-full object-cover"
                key={image} // Force re-render when image URL changes
              />
            ) : (
              <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl">{categoryInfo?.emoji || '🍽️'}</span>
                  <p className="text-emerald-700 mt-2 font-medium">Event Image</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
