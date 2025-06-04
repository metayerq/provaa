import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPriceOnly } from '@/utils/priceUtils';

interface FloatingBookingBarProps {
  price: number;
  spotsLeft: number;
  isVisible: boolean;
  onBookClick: () => void;
  onExpand: () => void;
}

export const FloatingBookingBar: React.FC<FloatingBookingBarProps> = ({
  price,
  spotsLeft,
  isVisible,
  onBookClick,
  onExpand
}) => {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transform transition-all duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
      style={{ 
        paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Price and spots info */}
        <div className="flex items-center space-x-3">
          <div>
            <div className="text-lg font-bold text-emerald-700">{formatPriceOnly(price)}</div>
            <div className={cn(
              "text-xs",
              spotsLeft <= 3 ? "text-red-600" : "text-gray-600"
            )}>
              {spotsLeft > 0 
                ? `${spotsLeft} spots left`
                : "Sold out"
              }
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Expand button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onExpand}
            className="border-emerald-200 hover:bg-emerald-50 p-2 active:scale-95 transition-transform"
          >
            <ChevronUp className="h-4 w-4 text-emerald-700" />
          </Button>
          
          {/* Book now button */}
          <Button
            onClick={onBookClick}
            disabled={spotsLeft <= 0}
            className="bg-emerald-700 hover:bg-emerald-800 px-6 active:scale-95 transition-transform"
          >
            {spotsLeft > 0 ? "Book Now" : "Sold Out"}
          </Button>
        </div>
      </div>
    </div>
  );
};
