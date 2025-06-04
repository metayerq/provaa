
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Wine } from 'lucide-react';
import { expandedCategories } from '@/utils/expandedCategories';

interface TypeFilterProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

const TypeFilter = ({ selectedCategories, onChange }: TypeFilterProps) => {
  const [open, setOpen] = useState(false);

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  const clearFilters = () => {
    onChange([]);
    setOpen(false);
  };

  const hasSelection = selectedCategories.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={hasSelection ? "default" : "outline"} 
          className={`h-10 px-4 rounded-full ${hasSelection ? 'bg-gray-900 text-white' : 'border-gray-300'}`}
        >
          <Wine className="h-4 w-4 mr-2" />
          Type
          {hasSelection && (
            <span className="ml-1 bg-white text-gray-900 rounded-full px-2 py-0.5 text-xs">
              {selectedCategories.length}
            </span>
          )}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Experience Type</h3>
            {hasSelection && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {expandedCategories.map(category => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`flex items-center gap-2 p-3 rounded-lg text-left text-sm transition-colors ${
                  selectedCategories.includes(category.id)
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <span className="text-base">{category.emoji}</span>
                <span className="font-medium truncate">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TypeFilter;
