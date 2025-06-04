
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateFilterProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

const DateFilter = ({ date, onSelect }: DateFilterProps) => {
  const [open, setOpen] = useState(false);

  const clearDate = () => {
    onSelect(undefined);
    setOpen(false);
  };

  const hasSelection = !!date;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={hasSelection ? "default" : "outline"} 
          className={`h-10 px-4 rounded-full ${hasSelection ? 'bg-gray-900 text-white' : 'border-gray-300'}`}
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          {date ? format(date, "MMM d") : "Date"}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Select Date</h3>
            {hasSelection && (
              <Button variant="ghost" size="sm" onClick={clearDate}>
                Clear
              </Button>
            )}
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              onSelect(selectedDate);
              setOpen(false);
            }}
            initialFocus
            className={cn("p-0 pointer-events-auto")}
            disabled={(date) => date < new Date()}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;
