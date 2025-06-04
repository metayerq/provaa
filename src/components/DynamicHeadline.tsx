
import React, { useEffect, useState, useRef } from 'react';

const rotatingWords = [
  "Food Experiences",
  "Wine Culture",
  "Local Artisans",
  "Chef Encounters",
  "Taste Adventures",
  "Hidden Tastings",
  "Culinary Secrets",
  "Italian Moments"
];

const DynamicHeadline = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const wordRef = useRef<HTMLSpanElement>(null);

  // Set initial loaded state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle word rotation
  useEffect(() => {
    // Don't start rotation until page has loaded
    if (!isLoaded) return;

    const wordRotationInterval = setInterval(() => {
      setIsAnimating(true);
      
      // After fade out animation completes, change the word
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 600); // Duration of fade out animation
      
    }, 3000); // Change every 3 seconds
    
    return () => clearInterval(wordRotationInterval);
  }, [isLoaded]);

  // Adjust underline width based on current word
  useEffect(() => {
    if (wordRef.current) {
      const underline = wordRef.current.nextElementSibling as HTMLElement;
      if (underline) {
        const wordWidth = wordRef.current.offsetWidth;
        underline.style.width = `${wordWidth}px`;
      }
    }
  }, [currentWordIndex, isAnimating]);

  return (
    <h1 className="mb-8 leading-tight tracking-tight">
      {/* Static part */}
      <span className={`block text-4xl md:text-5xl lg:text-[56px] tracking-wider animate-fade-in font-display text-black`} 
        style={{animationDelay: '0.1s'}}>
        Discover Authentic
      </span>
      
      {/* Dynamic part wrapper */}
      <div className="relative inline-block mt-1">
        {/* Rotating word */}
        <span
          ref={wordRef}
          className={`block text-4xl md:text-5xl lg:text-[56px] font-display font-semibold tracking-wide text-mint ${
            isAnimating ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'
          } transition-all duration-600 ease-in-out`}
        >
          {rotatingWords[currentWordIndex]}
        </span>
        
        {/* Animated underline */}
        <span className={`absolute -bottom-2 left-0 h-0.5 bg-mint transition-all duration-600 ease-in-out ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        }`}></span>
      </div>
    </h1>
  );
};

export default DynamicHeadline;
