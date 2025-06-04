import React from 'react';
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import { Event } from "../utils/mockData";
import { getCategoryEmoji } from "../utils/categoryResolver";
import { useCategoryName } from "../hooks/useCategoryName";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { formatPriceOnly } from '@/utils/priceUtils';

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const EventCard = ({ event, featured = false }: EventCardProps) => {
  const { id, title, category, date, location, price, spotsLeft, host, image } = event;
  const { categoryName, isLoading } = useCategoryName(category);
  
  // Don't show the category prefix "custom-" in the display
  const displayCategoryName = isLoading ? 'Loading...' : categoryName;
  
  return (
    <Link 
      to={`/events/${id}`}
      className={`block bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col cursor-pointer ${
        featured ? "border-2 border-amber-400" : ""
      }`}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-amber-50 overflow-hidden">
        {image ? (
          <img
            src={`${image}?auto=format&fit=crop&w=600&h=300`}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
            <span className="text-5xl">{getCategoryEmoji(category)}</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800 flex items-center gap-1">
            <span className="text-lg">{getCategoryEmoji(category)}</span>
            {displayCategoryName}
          </span>
        </div>
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-emerald-700 transition-colors">
          {title}
        </h3>
        
        <div className="space-y-2 mb-4 flex-grow">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
            {formatDate(date)} at {event.time}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
            {location.city}, {location.venue}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="h-4 w-4 mr-2 text-emerald-600" />
            {spotsLeft > 0
              ? `${spotsLeft} spots left`
              : "Sold out"
            }
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={host.image} alt={host.name} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-medium">
                {getInitials(host.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-gray-500">Hosted by</p>
              <p className="font-medium text-gray-900">{host.name}</p>
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-700">{formatPriceOnly(price)}</div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
