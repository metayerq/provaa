
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { getCategoryEmoji } from '@/utils/categoryResolver';
import { useCategoryName } from '@/hooks/useCategoryName';
import { HostRatingDisplay } from '@/components/host/HostRatingDisplay';
import AuthenticBadge from '@/components/ui/authentic-badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CulinaryEventTitleProps {
  title: string;
  category: string;
  categoryInfo?: {
    emoji?: string;
    label?: string;
  };
  host: {
    name: string;
    id?: string;
  };
  location: {
    city: string;
    venue: string;
  };
}

export const CulinaryEventTitle: React.FC<CulinaryEventTitleProps> = ({
  title,
  category,
  categoryInfo,
  host,
  location
}) => {
  const { categoryName, isLoading } = useCategoryName(category);

  // Fetch host rating data
  const { data: hostProfile } = useQuery({
    queryKey: ['host-profile', host.id],
    queryFn: async () => {
      if (!host.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('rating, review_count')
        .eq('id', host.id)
        .single();
      return data;
    },
    enabled: !!host.id,
  });

  // Use the resolved category name
  const displayCategoryName = isLoading ? 'Loading...' : categoryName;

  return (
    <div className="mb-8">
      {/* Badges */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm px-3 py-1 rounded-full border-0">
          <span className="mr-1">{getCategoryEmoji(category)}</span>
          {displayCategoryName}
        </Badge>
        <AuthenticBadge>
          🌱 Locally Sourced
        </AuthenticBadge>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif leading-tight">
        {title}
      </h1>

      {/* Host and Location Info */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <p className="text-lg text-gray-700">
          Hosted by <span className="font-semibold">{host.name}</span> at {location.venue}
        </p>
      </div>

      {/* Rating and Location */}
      <div className="flex flex-wrap items-center gap-6 text-gray-600">
        <HostRatingDisplay 
          rating={hostProfile?.rating || null}
          reviewCount={hostProfile?.review_count || 0}
          showEmptyState={true}
        />
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-emerald-600" />
          <span>{location.city}</span>
        </div>
      </div>
    </div>
  );
};
