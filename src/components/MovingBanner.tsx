
import React from 'react';

const MovingBanner = () => {
  // Experience titles with relevant emojis at the end for better visual appeal and recognition
  const experienceTitles = [
    "Deep Dive Fermenting 🧪",
    "Colombian Coffee Cupping ☕", 
    "Cold Brew Masterclass 🧊",
    "Natural Wine & Orange Wines 🍷",
    "Chef's Table Dinner 👨‍🍳",
    "Neapolitan Pizza Making 🍕",
    "Portuguese Cheese Journey 🧀",
    "Mezcal & Tequila Tasting 🥃",
    "Sourdough Starter Workshop 🍞",
    "Cantonese Dim Sum Class 🥟",
    "Third Wave Coffee Brewing ☕",
    "Talha Wine Experience 🍾",
    "French Croissant Technique 🥐",
    "Kombucha Brewing Lab 🫧",
    "Iberian Ham & Wine Pairing 🥓"
  ];
  
  // Duplicate the titles to create seamless loop
  const scrollingTitles = [...experienceTitles, ...experienceTitles];

  return (
    <div className="w-full overflow-hidden bg-light-gray border-y border-medium-gray py-4">
      <div className="relative">
        <div 
          className="flex whitespace-nowrap"
          style={{
            animation: 'scroll-left 20s linear infinite'
          }}
        >
          {scrollingTitles.map((title, index) => (
            <span
              key={index}
              className="flex-shrink-0 text-charcoal font-medium text-lg mx-8 whitespace-nowrap"
            >
              {title}
            </span>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default MovingBanner;
