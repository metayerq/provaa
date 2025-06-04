
import React from 'react';
import { Star } from 'lucide-react';

interface HostRatingDisplayProps {
  rating: number | null;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showEmptyState?: boolean;
  showNewHostBadge?: boolean;
}

export const HostRatingDisplay: React.FC<HostRatingDisplayProps> = ({
  rating,
  reviewCount = 0,
  size = 'md',
  showEmptyState = false,
  showNewHostBadge = true
}) => {
  // Show new host badge if no rating and showNewHostBadge is true
  if ((!rating || reviewCount === 0) && showNewHostBadge) {
    return (
      <div className="flex items-center gap-1 text-gray-600">
        <span className={`${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
          🆕 New host
        </span>
      </div>
    );
  }

  // Don't show anything if no rating exists and showEmptyState is false
  if (!rating || reviewCount === 0) {
    if (showEmptyState) {
      return (
        <div className="flex items-center gap-1 text-gray-500">
          <Star className={`${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />
          <span className={`${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
            New host
          </span>
        </div>
      );
    }
    return null;
  }

  // Format rating to 1 decimal place
  const formattedRating = rating.toFixed(1);

  return (
    <div className="flex items-center gap-1">
      <Star 
        className={`fill-amber-400 text-amber-400 ${
          size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
        }`} 
      />
      <span className={`font-medium text-gray-900 ${
        size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
      }`}>
        {formattedRating}
      </span>
      {reviewCount > 0 && (
        <span className={`text-gray-600 ${
          size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
        }`}>
          ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
        </span>
      )}
    </div>
  );
};
