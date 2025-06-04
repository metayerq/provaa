import React, { useState } from 'react';
import { Users, Star, Heart, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HostFollowButton } from '@/components/host/HostFollowButton';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { ShareModal } from '@/components/ShareModal';
import { SignInModal } from '@/components/booking/SignInModal';
import { EarlyRegistrationModal } from '@/components/booking/EarlyRegistrationModal';
import { HostRatingDisplay } from '@/components/host/HostRatingDisplay';
import { useHostProfile } from '@/hooks/useHostProfile';
import { formatPriceOnly } from '@/utils/priceUtils';

interface Host {
  id: string;
  name: string;
  bio: string;
  rating: number;
  events: number;
  image?: string;
}

interface EventSidebarProps {
  price: number;
  spotsLeft: number;
  onBookClick: () => void;
  host: Host;
  eventId?: string;
}

export const EventSidebar: React.FC<EventSidebarProps> = ({
  price,
  spotsLeft,
  onBookClick,
  host,
  eventId,
}) => {
  const { user } = useAuth();
  const { toggleFavorite, isFavorited, loading } = useFavorites();
  const { hostProfile, loading: hostLoading } = useHostProfile(host.id);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const handleSaveClick = () => {
    if (eventId) {
      if (!user) {
        // Show registration modal for non-authenticated users
        setIsRegistrationOpen(true);
      } else {
        toggleFavorite(eventId);
      }
    }
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleSignInClick = () => {
    setIsSignInOpen(true);
  };

  const handleSignInSuccess = () => {
    setIsSignInOpen(false);
    // Automatically save the event after successful sign-in
    if (eventId) {
      setTimeout(() => {
        toggleFavorite(eventId);
      }, 100); // Small delay to ensure auth state is updated
    }
  };

  const handleRegistrationSuccess = () => {
    setIsRegistrationOpen(false);
    // Automatically save the event after successful registration
    if (eventId) {
      setTimeout(() => {
        toggleFavorite(eventId);
      }, 100); // Small delay to ensure auth state is updated
    }
  };

  const handleSwitchToSignIn = () => {
    setIsRegistrationOpen(false);
    setIsSignInOpen(true);
  };

  const handleSwitchToRegister = () => {
    setIsSignInOpen(false);
    setIsRegistrationOpen(true);
  };

  const currentUrl = window.location.href;
  const eventTitle = document.title || 'Experience on Provaa';

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
        <div className="text-3xl font-bold text-emerald-700 mb-2">{formatPriceOnly(price)}</div>
        <div className={cn(
          "text-sm font-medium mb-6",
          spotsLeft <= 3 ? "text-red-600" : "text-gray-600"
        )}>
          <Users className="h-4 w-4 inline mr-1" />
          {spotsLeft > 0
            ? `${spotsLeft} spots left`
            : "Sold out"
          }
        </div>
        
        <Button 
          className="w-full bg-emerald-700 hover:bg-emerald-800 mb-4"
          disabled={spotsLeft <= 0}
          onClick={onBookClick}
        >
          {spotsLeft > 0 ? "Book Now" : "Sold Out"}
        </Button>
        
        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleSaveClick}
            disabled={loading}
          >
            <Heart 
              className={cn(
                "h-4 w-4 mr-2",
                eventId && user && isFavorited(eventId) 
                  ? "fill-red-500 text-red-500" 
                  : "text-gray-600"
              )} 
            />
            {eventId && user && isFavorited(eventId) ? "Saved" : "Save"}
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleShareClick}
          >
            <Share className="h-4 w-4 mr-2 text-gray-600" />
            Share
          </Button>
        </div>
        
        {/* Host Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              {host.image ? (
                <img
                  src={`${host.image}?auto=format&fit=crop&w=100&h=100`}
                  alt={host.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold">
                  {host.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Hosted by {host.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1 mb-2">
                {!hostLoading && (
                  <HostRatingDisplay 
                    rating={hostProfile?.rating || null}
                    reviewCount={hostProfile?.review_count || 0}
                    size="sm"
                    showNewHostBadge={true}
                  />
                )}
                <span className="ml-2">· {host.events} events</span>
              </div>
              <p className="text-sm text-gray-600">{host.bio}</p>
            </div>
          </div>
          
          {/* Follow Host Button */}
          <HostFollowButton 
            hostId={host.id}
            variant="outline"
            size="sm"
            showFollowerCount={true}
            className="w-full"
          />
        </div>

        {/* Guest Message - With clickable Sign in text */}
        {!user && (
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
            <p className="text-xs text-emerald-700 text-center">
              <button 
                onClick={handleSignInClick}
                className="text-emerald-700 underline hover:text-emerald-800 font-medium"
              >
                Sign in
              </button>
              {" "}to save events to your favorites
            </p>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        eventTitle={eventTitle}
        eventUrl={currentUrl}
      />

      {/* Early Registration Modal */}
      <EarlyRegistrationModal
        isOpen={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
        onSuccess={handleRegistrationSuccess}
        onSwitchToSignIn={handleSwitchToSignIn}
      />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        onSuccess={handleSignInSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </>
  );
};
