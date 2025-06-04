import React from 'react';
import { Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { formatPrice } from '@/utils/priceUtils';

interface EventInfoBarProps {
  date: string;
  time: string;
  duration: string;
  price: number;
  spotsLeft: number;
  formatDate: (date: string) => string;
}

export const EventInfoBar: React.FC<EventInfoBarProps> = ({
  date,
  time,
  duration,
  price,
  spotsLeft,
  formatDate,
}) => {
  return (
    <div className="absolute bottom-4 left-4 right-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-700">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span className="font-medium">{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-700">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span>{time}</span>
            {duration && <span className="text-gray-500">• {duration}</span>}
          </div>
          <div className="flex items-center gap-1 text-emerald-700 font-bold">
            <DollarSign className="h-4 w-4" />
            <span>{formatPrice(price, { currency: '$' })}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-700">
            <Users className="h-4 w-4 text-emerald-600" />
            <span className="font-medium">{spotsLeft} spots left</span>
          </div>
        </div>
      </div>
    </div>
  );
};
