import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { SignInModal } from '@/components/booking/SignInModal';
import { EarlyRegistrationModal } from '@/components/booking/EarlyRegistrationModal';

interface FavoriteButtonProps {
  eventId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  eventId,
  className = '',
  size = 'md',
  showBackground = true
}) => {
  const { user } = useAuth();
  const { toggleFavorite, isFavorited, loading } = useFavorites();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setIsRegistrationOpen(true);
    } else {
      toggleFavorite(eventId);
    }
  };

  const handleSignInSuccess = () => {
    setIsSignInOpen(false);
    setTimeout(() => {
      toggleFavorite(eventId);
    }, 100);
  };

  const handleRegistrationSuccess = () => {
    setIsRegistrationOpen(false);
    setTimeout(() => {
      toggleFavorite(eventId);
    }, 100);
  };

  const handleSwitchToSignIn = () => {
    setIsRegistrationOpen(false);
    setIsSignInOpen(true);
  };

  const handleSwitchToRegister = () => {
    setIsSignInOpen(false);
    setIsRegistrationOpen(true);
  };

  const isFavorite = user && isFavorited(eventId);

  return (
    <>
      <button
        onClick={handleFavoriteClick}
        disabled={loading}
        className={cn(
          'flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 group',
          sizeClasses[size],
          showBackground && 'bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white/90 hover:shadow-md',
          !showBackground && 'hover:bg-white/20',
          className
        )}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          className={cn(
            iconSizes[size],
            'transition-all duration-200',
            isFavorite
              ? 'fill-red-500 text-red-500 group-hover:scale-110'
              : 'text-gray-600 group-hover:text-red-500 group-hover:scale-110',
            loading && 'animate-pulse'
          )}
        />
      </button>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onOpenChange={setIsSignInOpen}
        onSuccess={handleSignInSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />

      {/* Registration Modal */}
      <EarlyRegistrationModal
        isOpen={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
        onSuccess={handleRegistrationSuccess}
        onSwitchToSignIn={handleSwitchToSignIn}
      />
    </>
  );
}; 