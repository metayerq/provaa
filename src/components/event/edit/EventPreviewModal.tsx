import React, { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventForm } from '@/components/event/form/types';
import { formatPriceOnly, formatPriceWithPerPerson } from '@/utils/priceUtils';

interface EventPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: EventForm;
  existingImageUrl?: string;
}

const EventPreviewModal: React.FC<EventPreviewModalProps> = ({
  isOpen,
  onClose,
  formData,
  existingImageUrl
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('EventPreviewModal state changed:', { isOpen, hasFormData: !!formData, imageUrl });
  }, [isOpen, formData, imageUrl]);

  // Handle image URL creation and cleanup
  useEffect(() => {
    if (formData.image && formData.image instanceof File) {
      try {
        const url = URL.createObjectURL(formData.image);
        setImageUrl(url);
        setImageError(false);
        console.log('Created blob URL for preview:', url);
        
        // Cleanup function to revoke the blob URL
        return () => {
          URL.revokeObjectURL(url);
          console.log('Revoked blob URL:', url);
        };
      } catch (error) {
        console.error('Failed to create blob URL:', error);
        setImageError(true);
        setImageUrl(null);
      }
    } else if (existingImageUrl) {
      setImageUrl(existingImageUrl);
      setImageError(false);
      console.log('Using existing image URL:', existingImageUrl);
    } else {
      setImageUrl(null);
      setImageError(false);
    }
  }, [formData.image, existingImageUrl]);

  const displayPrice = formatPriceOnly(formData.price);

  const handleImageError = useCallback(() => {
    console.warn('Failed to load preview image');
    setImageError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    console.log('Preview image loaded successfully');
  }, []);

  const formatDate = (date: Date) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return date.toLocaleDateString();
    }
  };

  // Prevent modal from closing on content click and add debugging
  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Content clicked, preventing close');
  }, []);

  // Enhanced onClose with debugging
  const handleClose = useCallback(() => {
    console.log('Preview modal closing');
    onClose();
  }, [onClose]);

  // Prevent modal from closing if formData is invalid
  if (!formData) {
    console.warn('EventPreviewModal: No form data provided');
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={handleContentClick}
        // Prevent escape key from closing during image load
        onEscapeKeyDown={(e) => {
          console.log('Escape key pressed in preview modal');
        }}
      >
        <DialogHeader>
          <DialogTitle>Event Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="relative">
            {imageUrl && !imageError ? (
              <img 
                src={imageUrl} 
                alt={formData.title || 'Event preview'}
                className="w-full h-64 object-cover rounded-lg"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div>No image available</div>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
              <span className="text-lg font-bold text-emerald-700">{displayPrice}</span>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">{formData.title || 'Event Title'}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {formData.date && (
                  <span>📅 {formatDate(formData.date)}</span>
                )}
                {formData.time && (
                  <span>🕐 {formData.time}</span>
                )}
                {formData.duration && (
                  <span>⏱️ {formData.duration}</span>
                )}
              </div>

              <div className="text-gray-600">
                {formData.isOnline ? (
                  <span>🌐 Online Event</span>
                ) : (
                  <div>
                    📍 {formData.venueName && <span>{formData.venueName}, </span>}
                    {formData.address && <span>{formData.address}, </span>}
                    {formData.city}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {formData.description || 'Event description will appear here...'}
                </p>
              </div>

              {formData.ambianceDescription && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ambiance</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{formData.ambianceDescription}</p>
                </div>
              )}

              {formData.dressCode && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Dress Code</h3>
                  <p className="text-gray-700">{formData.dressCode}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Booking Card Simulation */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-emerald-700 mb-1">{displayPrice}</div>
                  {formData.price > 0 && <div className="text-sm text-gray-500">per person</div>}
                </div>
                
                <div className="space-y-3 mb-4">
                  {formData.date && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-3">📅</span>
                      <span>{formatDate(formData.date)}</span>
                    </div>
                  )}
                  
                  {formData.time && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-3">🕐</span>
                      <span>{formData.time} • {formData.duration || '2.5h'}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-3">👥</span>
                    <span>{formData.capacity} spots available</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full bg-emerald-700 text-white py-2 px-4 rounded-md font-medium hover:bg-emerald-800 transition-colors">
                    Book Experience
                  </button>
                  <div className="flex gap-2">
                    <button className="flex-1 border border-gray-300 py-2 px-4 rounded-md text-sm hover:bg-gray-50 transition-colors">
                      ❤️ Save
                    </button>
                    <button className="flex-1 border border-gray-300 py-2 px-4 rounded-md text-sm hover:bg-gray-50 transition-colors">
                      📤 Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Event Details Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Event Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span>{formData.capacity} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span>{formatPriceWithPerPerson(formData.price)}</span>
                  </div>
                  {formData.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span>{formData.category}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Products Featured */}
              {formData.products && formData.products.length > 0 && formData.products.some(p => p.name?.trim()) && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Products Featured</h3>
                  <div className="space-y-3">
                    {formData.products.filter(p => p.name?.trim()).map((product, index) => (
                      <div key={index} className="border-l-4 border-emerald-500 pl-3">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        {product.producer && <div className="text-sm text-gray-600">by {product.producer}</div>}
                        <div className="flex gap-4 text-xs text-gray-500 mt-1">
                          {product.year && <span>Year: {product.year}</span>}
                          {product.type && <span>Type: {product.type}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {(formData.accessibilityInfo || formData.meetingPointDetails) && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
                  <div className="space-y-3 text-sm">
                    {formData.accessibilityInfo && (
                      <div>
                        <strong className="text-gray-700">Accessibility:</strong>
                        <p className="text-gray-600 mt-1">{formData.accessibilityInfo}</p>
                      </div>
                    )}
                    {formData.meetingPointDetails && (
                      <div>
                        <strong className="text-gray-700">Meeting Point:</strong>
                        <p className="text-gray-600 mt-1">{formData.meetingPointDetails}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            This is a preview of how your event will appear to visitors
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventPreviewModal;
