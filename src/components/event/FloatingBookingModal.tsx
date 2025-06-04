import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Clock, Calendar, X, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatPriceOnly } from '@/utils/priceUtils';

interface FloatingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
  spotsLeft: number;
  date: string;
  time: string;
  duration: string;
  capacity: number;
  onBookClick: () => void;
  formatDate: (dateString: string) => string;
  eventId: string;
  hostId?: string;
}

export const FloatingBookingModal: React.FC<FloatingBookingModalProps> = ({
  isOpen,
  onClose,
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

  // Check if the current user is the host
  const isHost = user && hostId && user.id === hostId;

  const handleEditClick = () => {
    navigate(`/host/events/${eventId}/edit`);
    onClose(); // Close the modal after navigation
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Modal */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl z-50 transform transition-all duration-300 ease-out md:hidden",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{ 
          paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)'
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Book Experience</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 active:scale-95 transition-transform"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Price Section */}
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-700 mb-1">{formatPriceOnly(price)}</div>
            {price > 0 && <div className="text-sm text-gray-600">per person</div>}
          </div>

          {/* Event Details */}
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-3 text-emerald-600" />
              <span>{formatDate(date)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-3 text-emerald-600" />
              <span>{time} ({duration})</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-3 text-emerald-600" />
              <span className={cn(
                "font-medium",
                spotsLeft <= 3 ? "text-red-600" : "text-gray-600"
              )}>
                {spotsLeft > 0 
                  ? `${spotsLeft} of ${capacity} spots left`
                  : "Sold out"
                }
              </span>
            </div>
          </div>

          {/* Edit Button - Only visible to host */}
          {isHost && (
            <Button
              onClick={handleEditClick}
              variant="outline"
              className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-3 text-base font-medium active:scale-95 transition-transform mb-2"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Experience
            </Button>
          )}

          {/* Book Button */}
          <Button
            onClick={onBookClick}
            disabled={spotsLeft <= 0}
            className="w-full bg-emerald-700 hover:bg-emerald-800 py-3 text-base font-medium active:scale-95 transition-transform"
          >
            {spotsLeft > 0 ? `Book Now - €${price}` : "Sold Out"}
          </Button>
        </div>
      </div>
    </>
  );
};
