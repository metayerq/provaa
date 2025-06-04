
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, DollarSign, Star } from 'lucide-react';

interface EventStats {
  totalEvents: number;
  totalAttendees: number;
  totalRevenue: number;
  averageRating: number;
  reviewCount?: number;
}

interface HostStatsCardsProps {
  stats: EventStats;
  onViewAllReviews?: () => void;
}

export const HostStatsCards: React.FC<HostStatsCardsProps> = ({ 
  stats, 
  onViewAllReviews 
}) => {
  const formatRating = (rating: number) => {
    return rating > 0 ? rating.toFixed(1) : 'No rating';
  };

  const formatReviewText = (count: number) => {
    if (count === 0) return 'No reviews yet';
    return `${count} review${count !== 1 ? 's' : ''}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-emerald-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              <p className="text-xs text-gray-500">Events</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendees</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAttendees}</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatRating(stats.averageRating)}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {formatReviewText(stats.reviewCount || 0)}
                </p>
                {onViewAllReviews && stats.reviewCount && stats.reviewCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onViewAllReviews}
                    className="text-xs h-auto p-1 text-emerald-600 hover:text-emerald-700"
                  >
                    View All
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
