
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Clock } from 'lucide-react';

interface DurationFilterProps {
  duration: string;
  onChange: (duration: string) => void;
}

const durationOptions = [
  { value: '', label: 'Any duration' },
  { value: '30min', label: '30 minutes' },
  { value: '45min', label: '45 minutes' },
  { value: '1h', label: '1 hour' },
  { value: '1.5h', label: '1.5 hours' },
  { value: '2h', label: '2 hours' },
  { value: '3h', label: '3 hours' },
  { value: '4h+', label: '4+ hours' },
];

const DurationFilter = ({ duration, onChange }: DurationFilterProps) => {
  const [open, setOpen] = useState(false);

  const selectDuration = (value: string) => {
    onChange(value);
    setOpen(false);
  };

  const hasSelection = duration !== '';
  const selectedOption = durationOptions.find(opt => opt.value === duration);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={hasSelection ? "default" : "outline"} 
          className={`h-10 px-4 rounded-full ${hasSelection ? 'bg-gray-900 text-white' : 'border-gray-300'}`}
        >
          <Clock className="h-4 w-4 mr-2" />
          {selectedOption?.label || 'Duration'}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-1">
          {durationOptions.map(option => (
            <button
              key={option.value}
              onClick={() => selectDuration(option.value)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                duration === option.value
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DurationFilter;
