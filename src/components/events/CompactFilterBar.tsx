import React from 'react';
import { Button } from '@/components/ui/button';
import DateFilter from './filters/DateFilter';
import GuestFilter from './filters/GuestFilter';
import DurationFilter from './filters/DurationFilter';

interface CompactFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  guestCount: number;
  setGuestCount: (count: number) => void;
  duration: string;
  setDuration: (duration: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  additionalFilters: any;
  setAdditionalFilters: (filters: any) => void;
}

const CompactFilterBar = ({
  selectedDate,
  setSelectedDate,
  guestCount,
  setGuestCount,
  duration,
  setDuration
}: CompactFilterBarProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      {/* Filter Pills - Removed Type, Price, and General Filters */}
      <div className="flex flex-wrap gap-3">
        <DateFilter
          date={selectedDate}
          onSelect={setSelectedDate}
        />
        
        <GuestFilter
          guestCount={guestCount}
          onChange={setGuestCount}
        />
        
        <DurationFilter
          duration={duration}
          onChange={setDuration}
        />
      </div>
    </div>
  );
};

export default CompactFilterBar;
