
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface HostEventsHeaderProps {
  onCreateEvent: () => void;
}

export const HostEventsHeader: React.FC<HostEventsHeaderProps> = ({
  onCreateEvent
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Experiences</h1>
        <p className="text-gray-600">Manage your culinary events and track your success</p>
      </div>
      <Button 
        className="bg-emerald-700 hover:bg-emerald-800 mt-4 md:mt-0"
        onClick={onCreateEvent}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Create New Experience
      </Button>
    </div>
  );
};
