
import React, { useEffect, useState, useRef } from 'react';

interface Experience {
  experience: string;
  host: string;
  location: string;
}

const experiences: Experience[] = [
  {
    experience: "Deep Dive Fermenting",
    host: "Olivia",
    location: "Sabor Mercearia"
  },
  {
    experience: "Talha Wine Tasting",
    host: "Jean",
    location: "Vivant Cellar"
  },
  {
    experience: "Coffee Deep Dive",
    host: "Bertrand",
    location: "Club Cafeine"
  },
  {
    experience: "Tagliatelle Hand Making",
    host: "Adrienne",
    location: "Between Collective"
  },
  {
    experience: "Sourdough Masterclass",
    host: "Ana",
    location: "Gleba Bakery"
  },
  {
    experience: "Cold Brew Lab",
    host: "Sarah",
    location: "The Mill"
  },
  {
    experience: "Dim Sum Folding",
    host: "Chef Liu",
    location: "Boa Bao Kitchen"
  },
  {
    experience: "Mozzarella Making",
    host: "Giuseppe",
    location: "Pizzeria Romana"
  },
  {
    experience: "Orange Wine Discovery",
    host: "Sophie",
    location: "By the Wine"
  },
  {
    experience: "Gin Blending",
    host: "Tom",
    location: "Red Frog Speakeasy"
  },
  {
    experience: "Latte Art Workshop",
    host: "João",
    location: "Copenhagen Coffee Lab"
  },
  {
    experience: "Cheese & Honey Pairing",
    host: "Marie",
    location: "Manteigaria Silva"
  },
  {
    experience: "Chocolate Tempering",
    host: "Beatriz",
    location: "Bettina & Niccolò"
  },
  {
    experience: "Natural Bubbles",
    host: "Inês",
    location: "Garrafeira Soares"
  },
  {
    experience: "Pickling Workshop",
    host: "Emma",
    location: "Mercearia Poço"
  }
];

const DetailedExperienceHeadline = () => {
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const experienceRef = useRef<HTMLSpanElement>(null);

  // Set initial loaded state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle experience rotation
  useEffect(() => {
    // Don't start rotation until page has loaded
    if (!isLoaded) return;

    // Start rotation after 2 seconds delay
    const initialDelay = setTimeout(() => {
      const experienceRotationInterval = setInterval(() => {
        setIsAnimating(true);
        
        // After fade out animation completes, change the experience
        setTimeout(() => {
          setCurrentExperienceIndex((prevIndex) => (prevIndex + 1) % experiences.length);
          setIsAnimating(false);
        }, 600); // Duration of fade out animation
        
      }, 5000); // Change every 5 seconds
      
      return () => clearInterval(experienceRotationInterval);
    }, 2000); // 2 second initial delay

    return () => clearTimeout(initialDelay);
  }, [isLoaded]);

  // Adjust underline width based on current experience
  useEffect(() => {
    if (experienceRef.current) {
      const underline = experienceRef.current.nextElementSibling as HTMLElement;
      if (underline) {
        const experienceWidth = experienceRef.current.offsetWidth;
        underline.style.width = `${experienceWidth}px`;
      }
    }
  }, [currentExperienceIndex, isAnimating]);

  const currentExperience = experiences[currentExperienceIndex];

  return (
    <h1 className="mb-6 leading-relaxed tracking-tight">
      <div className={`text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-display text-black animate-fade-in flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1`} 
        style={{animationDelay: '0.1s'}}>
        
        {/* Experience wrapper with underline */}
        <div className="relative inline-block">
          {/* Rotating experience - mint, medium weight */}
          <span
            ref={experienceRef}
            className={`font-medium text-mint ${
              isAnimating ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'
            } transition-all duration-600 ease-in-out`}
          >
            {currentExperience.experience}
          </span>
          
          {/* Animated underline */}
          <span className={`absolute -bottom-1 left-0 h-0.5 bg-mint transition-all duration-600 ease-in-out ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}></span>
        </div>
        
        {/* "with" - black, regular */}
        <span className="font-normal">with</span>
        
        {/* Host name - black, bold */}
        <span className={`font-bold text-black ${
          isAnimating ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'
        } transition-all duration-600 ease-in-out`}>
          {currentExperience.host}
        </span>
        
        {/* "at" - black, regular */}
        <span className="font-normal">at</span>
        
        {/* Location - dark gray, regular, not italic */}
        <span className={`font-normal text-charcoal ${
          isAnimating ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'
        } transition-all duration-600 ease-in-out`}>
          {currentExperience.location}
        </span>
      </div>
    </h1>
  );
};

export default DetailedExperienceHeadline;
