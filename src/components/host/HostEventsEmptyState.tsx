
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, PlusCircle } from 'lucide-react';

interface HostEventsEmptyStateProps {
  activeTab: string;
  onCreateEvent: () => void;
}

export const HostEventsEmptyState: React.FC<HostEventsEmptyStateProps> = ({
  activeTab,
  onCreateEvent
}) => {
  const getEmptyStateContent = () => {
    switch (activeTab) {
      case 'upcoming':
        return {
          title: 'No upcoming events',
          description: 'Create your first culinary experience to get started.',
          showCreateButton: true
        };
      case 'past':
        return {
          title: 'No past events',
          description: 'Events will appear here once available.',
          showCreateButton: false
        };
      case 'drafts':
        return {
          title: 'No draft events',
          description: 'Events will appear here once available.',
          showCreateButton: false
        };
      default:
        return {
          title: 'No events found',
          description: 'Events will appear here once available.',
          showCreateButton: false
        };
    }
  };

  const { title, description, showCreateButton } = getEmptyStateContent();

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {showCreateButton && (
          <Button 
            className="bg-emerald-700 hover:bg-emerald-800"
            onClick={onCreateEvent}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Experience
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
