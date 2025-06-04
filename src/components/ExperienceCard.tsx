import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Calendar, Clock } from 'lucide-react';
import { useCategoryName } from '@/hooks/useCategoryName';
import { getCategoryEmoji } from '@/utils/categoryResolver';
import { HostAvatar } from '@/components/host/HostAvatar';
import { formatPriceOnly } from '@/utils/priceUtils';
import { FavoriteButton } from '@/components/ui/FavoriteButton';

interface ExperienceCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: {
    venue_name?: string;
    city?: string;
  };
  price: number;
  capacity: number;
  spots_left: number;
  host_name: string;
  image?: string;
  category?: string;
  host_image?: string;
}

const ExperienceCard = ({
  id,
  title,
  date,
  time,
  location,
  price,
  capacity,
  spots_left,
  host_name,
  image,
  category,
  host_image
}: ExperienceCardProps) => {
  const { categoryName, isLoading } = useCategoryName(category || '');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
  };

  // Get category info
  const categoryEmoji = getCategoryEmoji(category || '');
  const resolvedCategoryName = isLoading ? 'Loading...' : categoryName;

  return (
    <div className="group relative bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 active:scale-[0.99] overflow-hidden">
      {/* Image with category overlay and favorite button */}
      <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
        <Link to={`/events/${id}`} className="block w-full h-full">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-mint flex items-center justify-center">
              <span className="text-2xl">{categoryEmoji}</span>
            </div>
          )}
        </Link>
        
        {/* Category tag in top-left corner */}
        {resolvedCategoryName && resolvedCategoryName !== 'Loading...' && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
              {categoryEmoji} {resolvedCategoryName}
            </span>
          </div>
        )}

        {/* Favorite button in top-right corner */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton 
            eventId={id}
            size="sm"
            showBackground={true}
          />
        </div>
      </div>

      {/* Content */}
      <Link to={`/events/${id}`} className="block">
        <div className="p-5">
          {/* Title */}
          <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
            {title}
          </h3>

          {/* Date and time with icons */}
          <div className="flex items-center text-sm text-emerald-600 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-medium">{formatFullDate(date)} at {time}</span>
          </div>

          {/* Location with icon */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
            <span>
              {location.city ? `${location.city}${location.venue_name ? `, ${location.venue_name}` : ''}` : 'TBD'}
            </span>
          </div>

          {/* Spots left with icon */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Users className="h-4 w-4 mr-2 text-emerald-600" />
            <span className="font-medium">{spots_left} spots left</span>
          </div>

          {/* Bottom section with host and price */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <HostAvatar 
                name={host_name}
                image={host_image}
                size="sm"
                className="mr-3"
              />
              <div>
                <p className="text-xs text-gray-500">Hosted by</p>
                <p className="text-sm font-medium text-gray-900">{host_name}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{formatPriceOnly(price)}</div>
              {price > 0 && <div className="text-xs text-gray-500">per person</div>}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ExperienceCard;
