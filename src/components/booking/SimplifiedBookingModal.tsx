import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Clock, Users, Calendar } from 'lucide-react';
import { formatPriceOnly } from '@/utils/priceUtils';

const bookingSchema = z.object({
  numberOfTickets: z.number().min(1).max(10),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface SimplifiedBookingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  eventId: string;
  eventTitle: string;
  hostName: string;
  date: string;
  time: string;
  location: string | { address?: string; city?: string; venue?: string; coordinates?: any };
  price: number;
  spotsLeft: number;
  onSuccess: () => void;
}

export const SimplifiedBookingModal: React.FC<SimplifiedBookingModalProps> = ({
  isOpen,
  onOpenChange,
  isMobile,
  eventId,
  eventTitle,
  hostName,
  date,
  time,
  location,
  price,
  spotsLeft,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Add debugging
  console.log('SimplifiedBookingModal props:', {
    isOpen,
    eventId,
    eventTitle,
    hostName,
    date,
    time,
    location,
    price,
    spotsLeft
  });

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      numberOfTickets: 1,
    }
  });

  const numberOfTickets = form.watch('numberOfTickets');
  const serviceFee = Math.round(price * numberOfTickets * 0.05 * 100) / 100;
  const totalAmount = (price * numberOfTickets) + serviceFee;

  const formatLocation = (locationData: any): string => {
    try {
      if (typeof locationData === 'string') {
        return locationData;
      }
      if (typeof locationData === 'object' && locationData !== null) {
        // Handle location object with properties like {address, city, venue, coordinates}
        if (locationData.venue && locationData.city) {
          return `${locationData.venue}, ${locationData.city}`;
        }
        if (locationData.address && locationData.city) {
          return `${locationData.address}, ${locationData.city}`;
        }
        if (locationData.venue) {
          return locationData.venue;
        }
        if (locationData.address) {
          return locationData.address;
        }
        if (locationData.city) {
          return locationData.city;
        }
      }
      return 'Location TBD';
    } catch (error) {
      console.error('Location formatting error:', error);
      return 'Location TBD';
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString; // Fallback to original string
    }
  };

  const onSubmit = form.handleSubmit(async (data) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book an event.",
        variant: "destructive",
      });
      return;
    }

    if (spotsLeft < numberOfTickets) {
      toast({
        title: "Not enough spots",
        description: `Only ${spotsLeft} spots available.`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log('🔄 Starting Stripe checkout process...');
      console.log('Event ID:', eventId);
      console.log('Number of tickets:', numberOfTickets);
      console.log('Price per ticket:', price);
      console.log('Total amount:', totalAmount);
      console.log('User:', user?.email);

      // Create Stripe Checkout Session using the correct function and parameters
      const { data: sessionData, error: sessionError } = await supabase
        .functions.invoke('create-stripe-checkout', {
          body: {
            eventId: eventId,
            numberOfTickets: numberOfTickets,
            pricePerTicket: price,
            totalAmount: totalAmount,
            guestInfo: {
              name: user.user_metadata?.full_name || user.email || '',
              email: user.email || '',
              phone: user.user_metadata?.phone || ''
            }
          }
        });

      console.log('📡 Supabase function response:', { sessionData, sessionError });

      if (sessionError) {
        console.error('❌ Session Error:', sessionError);
        throw new Error(sessionError.message || 'Failed to create checkout session');
      }

      if (!sessionData?.url) {
        console.error('❌ No URL returned:', sessionData);
        throw new Error('No checkout URL returned');
      }

      console.log('✅ Stripe checkout URL received:', sessionData.url);

      // Redirect to Stripe Checkout
      window.location.href = sessionData.url;

      toast({
        title: "Redirecting to payment...",
        description: "You're being redirected to complete your booking.",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  });

  const ModalContent = () => {
    try {
      return (
        <div className="space-y-6">
          {/* Event Header */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">{eventTitle || 'Experience'}</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Hosted by {hostName || 'Host'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(date) || 'Date TBD'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{time || 'Time TBD'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{formatLocation(location) || 'Location TBD'}</span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Number of Tickets */}
              <FormField
                control={form.control}
                name="numberOfTickets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Tickets</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={Math.min(10, spotsLeft || 1)}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{formatPriceOnly(price || 0)} × {numberOfTickets} ticket{numberOfTickets > 1 ? 's' : ''}</span>
                  <span>{formatPriceOnly((price || 0) * numberOfTickets)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service fee</span>
                  <span>{formatPriceOnly(serviceFee)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPriceOnly(totalAmount)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-lg py-6"
                disabled={isProcessing || (spotsLeft || 0) <= 0}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (spotsLeft || 0) <= 0 ? (
                  "Sold Out"
                ) : (
                  `Pay €${totalAmount.toFixed(2)} with Stripe`
                )}
              </Button>

              {(spotsLeft || 0) <= 5 && (spotsLeft || 0) > 0 && (
                <p className="text-center text-sm text-amber-600">
                  Only {spotsLeft} spot{spotsLeft === 1 ? '' : 's'} left!
                </p>
              )}
            </form>
          </Form>
        </div>
      );
    } catch (error) {
      console.error('ModalContent rendering error:', error);
      return (
        <div className="space-y-6">
          <div className="text-center text-red-600">
            <p>Sorry, there was an error loading the booking form.</p>
            <p className="text-sm">Please try again or contact support.</p>
          </div>
        </div>
      );
    }
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Book Your Experience</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto">
            <ModalContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Your Experience</DialogTitle>
        </DialogHeader>
        <ModalContent />
      </DialogContent>
    </Dialog>
  );
};
