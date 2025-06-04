
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const bookingRef = searchParams.get('booking_ref');

  useEffect(() => {
    const cancelBooking = async () => {
      if (bookingRef) {
        try {
          // Cancel the pending booking
          await supabase
            .from('bookings')
            .update({ 
              status: 'cancelled',
              payment_status: 'cancelled' 
            })
            .eq('booking_reference', bookingRef);

          toast({
            title: 'Payment Cancelled',
            description: 'Your booking has been cancelled and no payment was processed.',
          });
        } catch (error) {
          console.error('Error cancelling booking:', error);
        }
      }
    };

    cancelBooking();
  }, [bookingRef, toast]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Payment Cancelled</CardTitle>
            <p className="text-gray-600 mt-2">Your payment was cancelled and no charges were made</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {bookingRef && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  Booking reference <strong>{bookingRef}</strong> has been cancelled.
                </p>
              </div>
            )}

            <div className="text-center text-sm text-gray-600">
              <p>You can try booking again or browse other events.</p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Browse Events
              </Button>
              <Button 
                onClick={() => navigate(-1)}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentCancel;
