
import React from 'react';
import { Star, Calendar, MessageCircle } from 'lucide-react';

interface HostStatsProps {
  hasCompletedEvents: boolean;
  rating: number;
  actualReviewCount: number;
  completedEventsCount: number;
  languagesSpoken?: string[];
}

export const HostStats: React.FC<HostStatsProps> = ({
  hasCompletedEvents,
  rating,
  actualReviewCount,
  completedEventsCount,
  languagesSpoken
}) => {
  // Format languages spoken
  const formatLanguages = (languages?: string[]) => {
    if (!languages || languages.length === 0) {
      return "Languages not specified";
    }
    return `Fluent in ${languages.join(', ')}`;
  };

  return (
    <div className="mb-4">
      {/* Stats - only show if host has reviews */}
      {actualReviewCount > 0 && (
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-400 fill-current" />
            <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
            <span>({actualReviewCount} review{actualReviewCount !== 1 ? 's' : ''})</span>
          </div>
          {hasCompletedEvents && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{completedEventsCount} events hosted</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{formatLanguages(languagesSpoken)}</span>
          </div>
        </div>
      )}

      {/* New host message if no reviews */}
      {actualReviewCount === 0 && (
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-base">🆕</span>
            <span className="font-medium text-gray-700">New Host</span>
          </div>
          {hasCompletedEvents && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{completedEventsCount} events hosted</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{formatLanguages(languagesSpoken)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
