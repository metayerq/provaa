
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import CategoryFilter from '@/components/CategoryFilter';
import DateFilter from '@/components/DateFilter';
import PriceRangeFilter from '@/components/PriceRangeFilter';

interface EventsSearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const EventsSearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategories,
  setSelectedCategories,
  selectedDate,
  setSelectedDate,
  priceRange,
  setPriceRange,
  showFilters,
  setShowFilters
}: EventsSearchAndFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full lg:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search events..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      <div className={`${showFilters ? 'block' : 'hidden'} lg:block mt-6 lg:mt-4`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onChange={setSelectedCategories}
          />
          <DateFilter
            date={selectedDate}
            onSelect={setSelectedDate}
          />
          <PriceRangeFilter
            min={0}
            max={200}
            value={priceRange}
            onChange={setPriceRange}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsSearchAndFilters;
