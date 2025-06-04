import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import DetailedExperienceHeadline from '@/components/DetailedExperienceHeadline';
import AuthenticBadge from '@/components/ui/authentic-badge';
import MovingBanner from '@/components/MovingBanner';
import FeaturedExperiences from '@/components/FeaturedExperiences';
import BannerDisplay from '@/components/BannerDisplay';
import AirbnbStyleSearch from '@/components/search/AirbnbStyleSearch';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDiscover = () => {
    navigate('/events');
  };

  const handleHostExperience = () => {
    if (user) {
      navigate('/create-event');
    } else {
      navigate('/auth/signin');
    }
  };

  return (
    <Layout>
      {/* Hero Section with updated background */}
      <section className="hero-section relative bg-background-main py-8 md:py-10 px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-4">
            {/* Banner Display - positioned above everything */}
            <BannerDisplay />
            
            {/* Locally Sourced - centered with badge design */}
            <div className="mb-3 flex justify-center">
              <AuthenticBadge />
            </div>
            
            <div className="text-center">
              <DetailedExperienceHeadline />
            </div>

            {/* Subtitle - increased size and spacing */}
            <div className="text-center mb-10">
              <p className="text-xl text-text-secondary leading-relaxed">
                Meet the makers, hear their stories, and taste something extraordinary.
              </p>
            </div>

            {/* Airbnb Style Search Component */}
            <div className="mb-10">
              <AirbnbStyleSearch />
            </div>
            
            {/* Action buttons with updated colors */}
            <div className="max-w-2xl mx-auto mb-4 transition-all duration-700 transform" style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0.3s'
          }}>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleDiscover} 
                  variant="outline" 
                  size="lg" 
                  className="discover-cta-button bg-light-gray border-2 border-mint text-mint hover:bg-mint hover:text-white text-lg px-8 h-12 rounded-xl transition-all duration-200 hover:scale-[1.02] font-medium md:w-auto w-full md:bg-light-gray md:text-mint md:border-mint"
                >
                  <span className="hidden md:inline">DISCOVER</span>
                  <span className="md:hidden">DISCOVER EXPERIENCES</span>
                </Button>
                <Button 
                  onClick={handleHostExperience} 
                  variant="outline"
                  size="lg" 
                  className="host-cta-button border-2 border-secondary-orange text-secondary-orange hover:bg-secondary-orange hover:text-black text-lg px-8 h-12 rounded-xl transition-all duration-200 hover:scale-[1.02] font-medium"
                >
                  HOST AN EXPERIENCE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moving Banner Section */}
      <div className="moving-banner-section">
        <MovingBanner />
      </div>

      {/* Featured Experiences Section */}
      <div className="featured-experiences-section">
        <FeaturedExperiences />
      </div>
    </Layout>
  );
};

export default Home;
