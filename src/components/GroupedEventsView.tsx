
import React, { useState, useEffect } from 'react';
import { Event } from '@/utils/mockData';
import { GroupedData, groupEventsByType } from '@/utils/eventGrouping';
import GroupCard from './GroupCard';
import { MapPin, User, Calendar, Building } from 'lucide-react';

interface GroupedEventsViewProps {
  groupBy: string;
  groupedData: GroupedData;
  events: Event[];
}

const GroupedEventsView = ({ groupBy, groupedData: initialGroupedData, events }: GroupedEventsViewProps) => {
  const [groupedData, setGroupedData] = useState<GroupedData>(initialGroupedData);
  const [isResolving, setIsResolving] = useState(false);

  // Handle async category resolution for type groupings
  useEffect(() => {
    const resolveAsyncGrouping = async () => {
      if (groupBy === 'type' && events.length > 0) {
        setIsResolving(true);
        try {
          const resolved = await groupEventsByType(events);
          setGroupedData(resolved);
        } catch (error) {
          console.error('Error resolving category names:', error);
          setGroupedData(initialGroupedData);
        } finally {
          setIsResolving(false);
        }
      } else {
        setGroupedData(initialGroupedData);
      }
    };

    resolveAsyncGrouping();
  }, [groupBy, events, initialGroupedData]);

  const getTitle = () => {
    switch (groupBy) {
      case 'city':
        return 'Discover by Cities';
      case 'host':
        return 'Meet Our Hosts';
      case 'venue':
        return 'Unique Venues';
      case 'type':
        return 'Experience Types';
      default:
        return 'Discover Events';
    }
  };

  const getDescription = () => {
    switch (groupBy) {
      case 'city':
        return 'Explore culinary scenes across different cities and discover local food culture.';
      case 'host':
        return 'Connect with passionate food creators, chefs, and culinary experts.';
      case 'venue':
        return 'Experience unique locations that offer unforgettable dining atmospheres.';
      case 'type':
        return 'From intimate tastings to hands-on cooking classes, find your perfect experience.';
      default:
        return 'Find amazing culinary experiences near you.';
    }
  };

  const getIcon = () => {
    switch (groupBy) {
      case 'city':
        return <MapPin className="h-8 w-8 text-emerald-600" />;
      case 'host':
        return <User className="h-8 w-8 text-emerald-600" />;
      case 'venue':
        return <Building className="h-8 w-8 text-emerald-600" />;
      case 'type':
        return <Calendar className="h-8 w-8 text-emerald-600" />;
      default:
        return <Calendar className="h-8 w-8 text-emerald-600" />;
    }
  };

  const sortedGroups = Object.entries(groupedData).sort(([, a], [, b]) => b.count - a.count);

  if (isResolving) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading categories...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-amber-50 rounded-xl p-8 mb-8 border border-emerald-100">
        <div className="flex items-center mb-4">
          {getIcon()}
          <h1 className="text-3xl font-bold text-gray-900 ml-3">{getTitle()}</h1>
        </div>
        <p className="text-xl text-gray-600 mb-4">{getDescription()}</p>
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
            {Object.keys(groupedData).length} {groupBy === 'type' ? 'experience types' : `${groupBy}s`}
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
            {events.length} total events
          </span>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedGroups.map(([key, data]) => (
          <GroupCard
            key={key}
            title={groupBy === 'host' ? data.metadata?.hostName || key : key}
            count={data.count}
            metadata={data.metadata}
            groupType={groupBy as any}
            linkTo={`/events?${groupBy}=${encodeURIComponent(groupBy === 'host' ? data.metadata?.hostName || key : key)}`}
          />
        ))}
      </div>

      {/* Stats Footer */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center px-6 py-3 bg-gray-50 rounded-full">
          <span className="text-sm text-gray-600">
            Showing {Object.keys(groupedData).length} {groupBy === 'type' ? 'experience types' : `${groupBy}s`} with {events.length} total events
          </span>
        </div>
      </div>
    </div>
  );
};

export default GroupedEventsView;
