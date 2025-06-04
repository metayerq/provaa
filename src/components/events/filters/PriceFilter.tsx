import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, Euro } from 'lucide-react';
import { formatPriceOnly } from '@/utils/priceUtils';

interface PriceFilterProps {
  priceRange: [number, number];
  onChange: (range: [number, number]) => void;
}

const PriceFilter = ({ priceRange, onChange }: PriceFilterProps) => {
  const [open, setOpen] = useState(false);
  const [localRange, setLocalRange] = useState(priceRange);

  const handleSliderChange = (value: number[]) => {
    setLocalRange([value[0], value[1]] as [number, number]);
  };

  const applyFilter = () => {
    onChange(localRange);
    setOpen(false);
  };

  const clearFilter = () => {
    const defaultRange: [number, number] = [0, 200];
    setLocalRange(defaultRange);
    onChange(defaultRange);
    setOpen(false);
  };

  const hasSelection = priceRange[0] > 0 || priceRange[1] < 200;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={hasSelection ? "default" : "outline"} 
          className={`h-10 px-4 rounded-full ${hasSelection ? 'bg-gray-900 text-white' : 'border-gray-300'}`}
        >
          <Euro className="h-4 w-4 mr-2" />
          {hasSelection ? `${formatPriceOnly(priceRange[0])}-${formatPriceOnly(priceRange[1])}` : 'Price'}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Price Range</h3>
            {hasSelection && (
              <Button variant="ghost" size="sm" onClick={clearFilter}>
                Clear
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatPriceOnly(localRange[0])}</span>
              <span>{formatPriceOnly(localRange[1])}+</span>
            </div>
            
            <Slider
              value={localRange}
              onValueChange={handleSliderChange}
              max={200}
              min={0}
              step={1}
              className="w-full"
            />
            
            <div className="flex gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={clearFilter} className="flex-1">
                Clear
              </Button>
              <Button size="sm" onClick={applyFilter} className="flex-1">
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PriceFilter;
