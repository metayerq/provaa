
import React from 'react';

interface EventHeroProps {
  image?: string;
  categoryInfo?: {
    emoji?: string;
    label?: string;
  };
  category: string;
}

export const EventHero: React.FC<EventHeroProps> = ({ 
  image, 
  categoryInfo, 
  category 
}) => {
  return (
    <section className="relative">
      <div className="h-64 md:h-96 w-full bg-emerald-100">
        {image ? (
          <img
            src={`${image}?auto=format&fit=crop&w=2000&h=500`}
            alt="Event"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {categoryInfo?.emoji || '🍽️'}
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        
        <div className="absolute top-4 left-4 md:top-6 md:left-6">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800 flex items-center gap-1">
            <span className="text-lg">{categoryInfo?.emoji || '🍽️'}</span>
            {categoryInfo?.label || category}
          </span>
        </div>
      </div>
    </section>
  );
};
