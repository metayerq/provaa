
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface HostEventsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const HostEventsSearch: React.FC<HostEventsSearchProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="mb-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};
