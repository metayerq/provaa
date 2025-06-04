
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Users, Plus, Minus } from 'lucide-react';

interface GuestFilterProps {
  guestCount: number;
  onChange: (count: number) => void;
}

const GuestFilter = ({ guestCount, onChange }: GuestFilterProps) => {
  const [open, setOpen] = useState(false);

  const increment = () => {
    if (guestCount < 20) {
      onChange(guestCount + 1);
    }
  };

  const decrement = () => {
    if (guestCount > 1) {
      onChange(guestCount - 1);
    }
  };

  const hasSelection = guestCount > 1;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={hasSelection ? "default" : "outline"} 
          className={`h-10 px-4 rounded-full ${hasSelection ? 'bg-gray-900 text-white' : 'border-gray-300'}`}
        >
          <Users className="h-4 w-4 mr-2" />
          {guestCount === 1 ? "1 Guest" : `${guestCount} Guests`}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="start">
        <div className="space-y-4">
          <h3 className="font-semibold">Number of Guests</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Guests</div>
              <div className="text-sm text-gray-600">Ages 13 or above</div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={decrement}
                disabled={guestCount <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="w-8 text-center font-medium">{guestCount}</span>
              
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={increment}
                disabled={guestCount >= 20}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                onChange(1);
                setOpen(false);
              }}
              className="w-full"
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GuestFilter;
