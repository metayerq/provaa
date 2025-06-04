
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, User, Calendar, Building, Star } from 'lucide-react';
import { getCategoryEmoji } from '@/utils/categoryResolver';

interface GroupCardProps {
  title: string;
  count: number;
  metadata?: any;
  groupType: 'city' | 'host' | 'venue' | 'type';
  linkTo: string;
}

const GroupCard = ({ title, count, metadata, groupType, linkTo }: GroupCardProps) => {
  const getIcon = () => {
    switch (groupType) {
      case 'city':
        return <MapPin className="h-6 w-6 text-emerald-600" />;
      case 'host':
        return <User className="h-6 w-6 text-emerald-600" />;
      case 'venue':
        return <Building className="h-6 w-6 text-emerald-600" />;
      case 'type':
        return <Calendar className="h-6 w-6 text-emerald-600" />;
      default:
        return <Calendar className="h-6 w-6 text-emerald-600" />;
    }
  };

  const getSubtitle = () => {
    switch (groupType) {
      case 'city':
        return `${metadata?.venues || 0} venues • Avg $${metadata?.avgPrice || 0}`;
      case 'host':
        return (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="ml-1 text-sm">{metadata?.rating || 4.8}</span>
            </div>
            <span>•</span>
            <span className="text-sm">{metadata?.totalEvents || 0} total events</span>
          </div>
        );
      case 'venue':
        return `${metadata?.city || ''} • Avg $${metadata?.avgPrice || 0}`;
      case 'type':
        return `${metadata?.cities || 0} cities • Avg $${metadata?.avgPrice || 0}`;
      default:
        return '';
    }
  };

  const getCategoryIcon = () => {
    if (groupType === 'type' && metadata?.categoryId) {
      return (
        <div className="text-2xl mr-3">
          {getCategoryEmoji(metadata.categoryId)}
        </div>
      );
    }
    return null;
  };

  return (
    <Link to={linkTo}>
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-emerald-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start flex-1">
              {getCategoryIcon()}
              <div className="flex items-center mr-4">
                {getIcon()}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {title}
                </h3>
                <div className="text-gray-600 text-sm mb-2">
                  {getSubtitle()}
                </div>
                {groupType === 'host' && metadata?.bio && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {metadata.bio}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-700">
                {count}
              </div>
              <div className="text-sm text-gray-500">
                {count === 1 ? 'event' : 'events'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GroupCard;
