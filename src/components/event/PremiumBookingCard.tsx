import React, { useState } from 'react';
import { Clock, Calendar, Users, MapPin, Heart, Share, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { ShareModal } from '@/components/ShareModal';
import { SignInModal } from '@/components/booking/SignInModal';
import { EarlyRegistrationModal } from '@/components/booking/EarlyRegistrationModal';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { formatPriceOnly } from '@/utils/priceUtils';

interface PremiumBookingCardProps {
  price: number;
  spotsLeft: number;
  date: string;
  time: string;
  duration: string;
  capacity: number;
  onBookClick: (guests: number) => void;
  formatDate: (dateString: string) => string;
  eventId: string;
  hostId?: string;
}

export const PremiumBookingCard: React.FC<PremiumBookingCardProps> = ({
  price,
  spotsLeft,
  date,
  time,
  duration,
  capacity,
  onBookClick,
  formatDate,
  eventId,
  hostId
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorited, loading } = useFavorites();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  // Check if the current user is the host
  const isHost = user && hostId && user.id === hostId;

  // Check if event has passed (considering both date and time)
  const isEventPassed = () => {
    if (!date || !time) return false;
    
    const now = new Date();
    const eventStart = new Date(`${date}T${time}`);
    
    // Calculate event end time (assume 2.5 hours if no duration specified)
    let durationHours = 2.5;
    if (duration) {
      const durationMatch = duration.match(/(\d+(\.\d+)?)/);
      if (durationMatch) {
        durationHours = parseFloat(durationMatch[1]);
      }
    }
    const eventEnd = new Date(eventStart.getTime() + (durationHours * 60 * 60 * 1000));
    
    return now > eventEnd;
  };

  const isEventLive = () => {
    if (!date || !time) return false;
    
    const now = new Date();
    const eventStart = new Date(`${date}T${time}`);
    
    // Calculate event end time
    let durationHours = 2.5;
    if (duration) {
      const durationMatch = duration.match(/(\d+(\.\d+)?)/);
      if (durationMatch) {
        durationHours = parseFloat(durationMatch[1]);
      }
    }
    const eventEnd = new Date(eventStart.getTime() + (durationHours * 60 * 60 * 1000));
    
    return now >= eventStart && now <= eventEnd;
  };

  const eventPassed = isEventPassed();
  const eventLive = isEventLive();
  const isSoldOut = spotsLeft === 0;

  const getBookingButtonText = () => {
    if (eventPassed) return 'Event Ended';
    if (eventLive) return 'Event in Progress';
    if (isSoldOut) return 'Sold Out';
    return 'Book Experience';
  };

  const getBookingButtonVariant = () => {
    if (eventPassed || eventLive) return 'secondary';
    if (isSoldOut) return 'destructive';
    return 'default';
  };

  const isBookingDisabled = eventPassed || eventLive || isSoldOut;

  const handleSaveClick = () => {
    if (!user) {
      // Show registration modal for non-authenticated users
      setIsRegistrationOpen(true);
    } else {
      toggleFavorite(eventId);
    }
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleSignInSuccess = () => {
    setIsSignInOpen(false);
    // Automatically save the event after successful sign-in
    setTimeout(() => {
      toggleFavorite(eventId);
    }, 100); // Small delay to ensure auth state is updated
  };

  const handleRegistrationSuccess = () => {
    setIsRegistrationOpen(false);
    // Automatically save the event after successful registration
    setTimeout(() => {
      toggleFavorite(eventId);
    }, 100); // Small delay to ensure auth state is updated
  };

  const handleSwitchToSignIn = () => {
    setIsRegistrationOpen(false);
    setIsSignInOpen(true);
  };

  const handleSwitchToRegister = () => {
    setIsSignInOpen(false);
    setIsRegistrationOpen(true);
  };

  const handleEditClick = () => {
    navigate(`/host/events/${eventId}/edit`);
  };

  const currentUrl = window.location.href;
  const eventTitle = document.title || 'Experience on Provaa';

  return (
    <>
      <div className="sticky top-8">
        <Card className="shadow-lg border-2 border-emerald-100">
          <CardContent className="p-6">
            {/* Price Section */}
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-1">{formatPriceOnly(price)}</div>
              {price > 0 && <div className="text-sm text-gray-500">per person</div>}
            </div>

            {/* Event Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-3 text-emerald-600" />
                <span className="text-sm">{formatDate(date)}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-3 text-emerald-600" />
                <span className="text-sm">{time} • {duration || '2.5h'}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-3 text-emerald-600" />
                <span className="text-sm">
                  {isSoldOut ? 'Sold out' : `${spotsLeft} of ${capacity} spots left`}
                </span>
              </div>
            </div>

            {/* Status Indicator */}
            {(eventLive || eventPassed || isSoldOut) && (
              <div className="mb-4 p-3 rounded-lg text-center text-sm">
                {eventLive && (
                  <div className="bg-red-50 text-red-700 border border-red-200">
                    🔴 Event is currently in progress
                  </div>
                )}
                {eventPassed && !eventLive && (
                  <div className="bg-gray-50 text-gray-700 border border-gray-200">
                    ⏰ This event has ended
                  </div>
                )}
                {isSoldOut && !eventPassed && !eventLive && (
                  <div className="bg-red-50 text-red-700 border border-red-200">
                    🎫 This event is sold out
                  </div>
                )}
              </div>
            )}

            {/* Edit Button - Only visible to host */}
            {isHost && (
              <Button
                onClick={handleEditClick}
                variant="outline"
                className="w-full h-12 text-base font-semibold mb-4 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Experience
              </Button>
            )}

            {/* Booking Button */}
            <Button
              onClick={() => !isBookingDisabled && onBookClick(1)}
              disabled={isBookingDisabled}
              variant={getBookingButtonVariant()}
              className="w-full h-12 text-base font-semibold mb-4"
            >
              {getBookingButtonText()}
            </Button>

            {/* Save and Share Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleSaveClick}
                disabled={loading}
              >
                <Heart 
                  className={cn(
                    "h-4 w-4 mr-2",
                    user && isFavorited(eventId) 
                      ? "fill-red-500 text-red-500" 
                      : "text-gray-600"
                  )} 
                />
                {user && isFavorited(eventId) ? "Saved" : "Save"}
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

            {/* Guest Message - With clickable Sign in text */}
            {!user && (
              <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-emerald-700 text-center">
                  <button 
                    onClick={() => setIsSignInOpen(true)}
                    className="text-emerald-700 underline hover:text-emerald-800 font-medium"
                  >
                    Sign in
                  </button>
                  {" "}to save events to your favorites
                </p>
              </div>
            )}

            {/* Additional Info */}
            {!eventPassed && !eventLive && !isSoldOut && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Free cancellation up to 48 hours before
                </p>
              </div>
            )}
          </CardContent>
        </Card>
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
