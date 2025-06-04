
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { HostReview } from '@/hooks/useHostReviews';
import { format } from 'date-fns';

interface HostReviewsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reviews: HostReview[];
  eventTitle?: string;
  loading: boolean;
}

export const HostReviewsModal: React.FC<HostReviewsModalProps> = ({
  isOpen,
  onOpenChange,
  reviews,
  eventTitle,
  loading
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {eventTitle ? `Reviews for ${eventTitle}` : 'All Reviews'}
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reviews yet for this {eventTitle ? 'event' : 'host'}.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="border-l-4 border-l-emerald-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                      <span className="font-medium text-gray-900">
                        {review.rating}/5
                      </span>
                      <span className="text-gray-600">-</span>
                      <span className="font-medium text-gray-900">
                        {review.user.full_name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(review.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  
                  {review.review_text && (
                    <p className="text-gray-700 mb-3 italic">
                      "{review.review_text}"
                    </p>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    {review.event.title} - {format(new Date(review.event.date), 'MMM dd, yyyy')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
