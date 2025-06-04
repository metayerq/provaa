import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import { formatPriceOnly } from '@/utils/priceUtils';

interface BookingCardHeaderProps {
  title?: string;
  bookingReference: string;
  createdAt: string;
  status: string;
  cancelledAt?: string;
  activeTab: string;
  cancellationDeadlineText?: string | null;
  totalAmount: number;
  pricePerTicket: number;
  numberOfTickets: number;
}

export const BookingCardHeader: React.FC<BookingCardHeaderProps> = ({
  title,
  bookingReference,
  createdAt,
  status,
  cancelledAt,
  activeTab,
  cancellationDeadlineText,
  totalAmount,
  pricePerTicket,
  numberOfTickets
}) => {
  const formatCreatedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const formatCancelledDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy \'at\' h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-sm font-medium text-emerald-700 mb-1">
          Reference: {bookingReference}
        </p>
        <p className="text-xs text-gray-500 mb-2">
          Booked on {formatCreatedDate(createdAt)}
        </p>
        
        {/* Cancellation deadline info for upcoming bookings */}
        {activeTab === 'upcoming' && status !== 'cancelled' && cancellationDeadlineText && (
          <div className={`flex items-center gap-1 text-xs mb-2 ${
            cancellationDeadlineText.includes('passed') 
              ? 'text-red-600' 
              : cancellationDeadlineText.includes('hours')
              ? 'text-amber-600'
              : 'text-green-600'
          }`}>
            <AlertCircle className="h-3 w-3" />
            {cancellationDeadlineText}
          </div>
        )}
        
        {status === 'cancelled' && (
          <div className="space-y-1">
            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              Cancelled
            </span>
            {cancelledAt && (
              <p className="text-xs text-red-600">
                Cancelled on {formatCancelledDate(cancelledAt)}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-emerald-700">
          {formatPriceOnly(pricePerTicket)} × {numberOfTickets}
        </p>
        <p className="text-gray-600 text-sm">
          Total: {formatPriceOnly(totalAmount)}
        </p>
      </div>
    </div>
  );
};
