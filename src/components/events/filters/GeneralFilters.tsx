
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

interface GeneralFiltersProps {
  filters: any;
  onChange: (filters: any) => void;
}

const GeneralFilters = ({ filters, onChange }: GeneralFiltersProps) => {
  const [open, setOpen] = useState(false);

  const toggleFilter = (key: string, value: any) => {
    onChange({
      ...filters,
      [key]: filters[key] === value ? undefined : value
    });
  };

  const clearAllFilters = () => {
    onChange({});
    setOpen(false);
  };

  const hasFilters = Object.keys(filters).some(key => filters[key] !== undefined);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={hasFilters ? "default" : "outline"} 
          className={`h-10 px-4 rounded-full ${hasFilters ? 'bg-gray-900 text-white' : 'border-gray-300'}`}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {hasFilters && (
            <span className="ml-1 bg-white text-gray-900 rounded-full px-2 py-0.5 text-xs">
              •
            </span>
          )}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Additional Filters</h3>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">Accessibility</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.wheelchairAccessible || false}
                    onChange={(e) => toggleFilter('wheelchairAccessible', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Wheelchair accessible</span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Dietary Options</h4>
              <div className="space-y-2">
                {['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free'].map(option => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.dietaryOptions?.includes(option) || false}
                      onChange={(e) => {
                        const current = filters.dietaryOptions || [];
                        const updated = e.target.checked
                          ? [...current, option]
                          : current.filter((item: string) => item !== option);
                        toggleFilter('dietaryOptions', updated.length > 0 ? updated : undefined);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GeneralFilters;
