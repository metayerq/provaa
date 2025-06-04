import React, { useState } from 'react';
import { Event } from '@/utils/mockData';
import { categories } from '@/utils/mockData';
import Layout from '@/components/layout/Layout';
import { SidePictureEventHero } from './SidePictureEventHero';
import { EventMainContent } from './EventMainContent';
import { PremiumBookingCard } from './PremiumBookingCard';
import { BookingModal } from './BookingModal';
import { EarlyRegistrationModal } from '@/components/booking/EarlyRegistrationModal';
import { SignInModal } from '@/components/booking/SignInModal';
import { FloatingBookingBar } from './FloatingBookingBar';
import { FloatingBookingModal } from './FloatingBookingModal';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useCategoryName } from '@/hooks/useCategoryName';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { getCategoryEmoji } from '@/utils/categoryResolver';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface EventDetailContentProps {
  event: Event;
}

export const EventDetailContent: React.FC<EventDetailContentProps> = ({ event }) => {
  const { user } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEarlyRegistrationOpen, setIsEarlyRegistrationOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isFloatingModalOpen, setIsFloatingModalOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { isScrolled } = useScrollPosition(300);
  const { categoryName, isLoading } = useCategoryName(event.category);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Get category info with resolved name
  const categoryInfo = {
    emoji: getCategoryEmoji(event.category),
    label: isLoading ? 'Loading...' : categoryName
  };

  // Toggle booking dialog/drawer
  const onBookingSuccess = () => {
    setIsBookingOpen(false);
    setIsFloatingModalOpen(false);
  };

  const handleBookClick = (guests: number) => {
    // Check if user is authenticated - if not, show auth modal
    if (!user) {
      setIsEarlyRegistrationOpen(true);
    } else {
      // Proceed directly to simplified booking modal
      setIsBookingOpen(true);
    }
  };

  const handleFloatingBookClick = () => {
    handleBookClick(1);
  };

  const handleFloatingExpand = () => {
    setIsFloatingModalOpen(true);
  };

  const handleFloatingModalBookClick = () => {
    setIsFloatingModalOpen(false);
    handleBookClick(1);
  };

  const handleRegistrationSuccess = () => {
    setIsEarlyRegistrationOpen(false);
    // Automatically open booking modal after successful registration
    setIsBookingOpen(true);
  };

  const handleSignInSuccess = () => {
    setIsSignInOpen(false);
    // Automatically open booking modal after successful sign-in
    setIsBookingOpen(true);
  };

  const handleSwitchToSignIn = () => {
    setIsEarlyRegistrationOpen(false);
    setIsSignInOpen(true);
  };

  const handleSwitchToRegister = () => {
    setIsSignInOpen(false);
    setIsEarlyRegistrationOpen(true);
  };

  // Create host object with proper structure including ID
  const hostWithId = {
    ...event.host,
    id: event.host.id // Ensure the host ID is passed correctly
  };

  return (
    <Layout>
      {/* Side Picture Hero Section */}
      <SidePictureEventHero
        image={event.image}
        title={event.title}
        category={event.category}
        categoryInfo={categoryInfo}
        host={hostWithId}
        location={event.location}
        date={event.date}
        time={event.time}
        duration={event.duration}
        capacity={event.capacity}
        spotsLeft={event.spotsLeft}
        price={event.price}
      />

      {/* Two-column layout */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content - Left Column */}
          <EventMainContent event={event} />
          
          {/* Right Column - Booking Card (Hidden on mobile when floating bar is active) */}
          <div className={cn(
            "lg:col-span-1",
            isMobile && isScrolled && "hidden"
          )}>
            <PremiumBookingCard
              price={event.price}
              spotsLeft={event.spotsLeft}
              date={event.date}
              time={event.time}
              duration={event.duration}
              capacity={event.capacity}
              onBookClick={handleBookClick}
              formatDate={formatDate}
              eventId={event.id}
              hostId={event.host.id}
            />
          </div>
        </div>
      </section>

      {/* Floating Booking Bar - Mobile Only */}
      {isMobile && (
        <FloatingBookingBar
          price={event.price}
          spotsLeft={event.spotsLeft}
          isVisible={isScrolled}
          onBookClick={handleFloatingBookClick}
          onExpand={handleFloatingExpand}
        />
      )}

      {/* Floating Booking Modal - Mobile Only */}
      {isMobile && (
        <FloatingBookingModal
          isOpen={isFloatingModalOpen}
          onClose={() => setIsFloatingModalOpen(false)}
          price={event.price}
          spotsLeft={event.spotsLeft}
          date={event.date}
          time={event.time}
          duration={event.duration}
          capacity={event.capacity}
          onBookClick={handleFloatingModalBookClick}
          formatDate={formatDate}
          eventId={event.id}
          hostId={event.host.id}
        />
      )}

      {/* Simplified Booking Modal - For all users */}
      <BookingModal
        isOpen={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        isMobile={isMobile}
        eventId={event.id}
        eventTitle={event.title}
        hostName={event.host?.name || event.host?.full_name || 'Host'}
        date={event.date}
        time={event.time}
        location={event.location}
        price={event.price}
        spotsLeft={event.spotsLeft}
        onSuccess={onBookingSuccess}
      />

      {/* Early Registration Modal - For non-authenticated users */}
      <EarlyRegistrationModal
        isOpen={isEarlyRegistrationOpen}
        onOpenChange={setIsEarlyRegistrationOpen}
        onSuccess={handleRegistrationSuccess}
        onSwitchToSignIn={handleSwitchToSignIn}
      />

      {/* Sign In Modal - For existing users */}
      <SignInModal
        isOpen={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        onSuccess={handleSignInSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </Layout>
  );
};
