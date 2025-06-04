import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  MoreVertical,
  Mail,
  Phone,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { AttendeeDetailsModal } from './AttendeeDetailsModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AttendeeData {
  id: string;
  booking_reference: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  number_of_tickets: number;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  dietary_restrictions?: string;
  special_requests?: string;
  event_id: string;
}

interface PendingBookingsPanelProps {
  pendingBookings: AttendeeData[];
  onBookingUpdate: () => void;
}

export const PendingBookingsPanel: React.FC<PendingBookingsPanelProps> = ({
  pendingBookings,
  onBookingUpdate
}) => {
  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingBooking, setProcessingBooking] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState<string | null>(null);
  const { toast } = useToast();

  // Enhanced filtering to ensure only truly pending bookings are shown
  const validPendingBookings = pendingBookings.filter(booking => {
    const isPending = booking.status === 'pending';
    const isNotCancelled = booking.status !== 'cancelled';
    
    console.log(`Booking ${booking.booking_reference}: status=${booking.status}, payment_status=${booking.payment_status}, valid=${isPending && isNotCancelled}`);
    
    return isPending && isNotCancelled;
  });

  const handleViewDetails = (attendee: AttendeeData) => {
    console.log('Viewing details for booking:', attendee.booking_reference, 'ID:', attendee.id);
    setSelectedAttendee(attendee);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAttendee(null);
  };

  const handleBookingUpdated = () => {
    handleModalClose();
    onBookingUpdate();
  };

  const handleConfirmBooking = async (bookingId: string, bookingRef: string) => {
    console.log(`Attempting to confirm booking ID: ${bookingId}, Reference: ${bookingRef}`);
    setProcessingBooking(bookingId);
    
    try {
      // First, verify the booking exists and is still pending
      const { data: currentBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (fetchError) {
        console.error('Error fetching current booking state:', fetchError);
        throw new Error(`Failed to fetch booking ${bookingRef}: ${fetchError.message}`);
      }

      if (!currentBooking) {
        throw new Error(`Booking ${bookingRef} not found`);
      }

      if (currentBooking.status !== 'pending') {
        throw new Error(`Booking ${bookingRef} is no longer pending (current status: ${currentBooking.status})`);
      }

      console.log('Current booking state before confirmation:', currentBooking);

      // Check if spots have already been decremented to avoid double-decrementing
      if (!currentBooking.spots_decremented) {
        // Use the same pattern as Stripe payment verification - decrement spots first
        const { error: spotsError } = await supabase.rpc('increment_event_spots', {
          event_id: currentBooking.event_id,
          spots_to_add: -currentBooking.number_of_tickets
        });

        if (spotsError) {
          console.error('Error decrementing event spots:', spotsError);
          throw new Error(`Failed to update event spots: ${spotsError.message}`);
        }

        console.log('✅ Successfully decremented spots by:', currentBooking.number_of_tickets);
      } else {
        console.log('⚠️ Spots already decremented for this booking');
      }

      // Update booking status and mark spots as decremented
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed',
          payment_status: 'paid',
          spots_decremented: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking:', error);
        // If booking update fails after spots were decremented, we need to revert the spots
        if (!currentBooking.spots_decremented) {
          await supabase.rpc('increment_event_spots', {
            event_id: currentBooking.event_id,
            spots_to_add: currentBooking.number_of_tickets
          });
        }
        throw error;
      }

      console.log(`Successfully confirmed booking ${bookingRef}`);
      
      toast({
        title: "Booking Confirmed",
        description: `Booking ${bookingRef} has been manually confirmed and spots have been updated.`,
      });

      onBookingUpdate();
    } catch (error: any) {
      console.error('Error confirming booking:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to confirm booking ${bookingRef}`,
        variant: "destructive"
      });
    } finally {
      setProcessingBooking(null);
      setConfirmDialogOpen(null);
    }
  };

  const handleCancelBooking = async (bookingId: string, bookingRef: string) => {
    console.log(`Attempting to cancel booking ID: ${bookingId}, Reference: ${bookingRef}`);
    setProcessingBooking(bookingId);
    
    try {
      // First, verify the booking exists and can be cancelled
      const { data: currentBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (fetchError) {
        console.error('Error fetching current booking state:', fetchError);
        throw new Error(`Failed to fetch booking ${bookingRef}: ${fetchError.message}`);
      }

      if (!currentBooking) {
        throw new Error(`Booking ${bookingRef} not found`);
      }

      if (currentBooking.status === 'cancelled') {
        throw new Error(`Booking ${bookingRef} is already cancelled`);
      }

      console.log('Current booking state before cancellation:', currentBooking);

      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking:', error);
        throw error;
      }

      console.log(`Successfully cancelled booking ${bookingRef}`);

      toast({
        title: "Booking Cancelled",
        description: `Booking ${bookingRef} has been cancelled.`,
      });

      onBookingUpdate();
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to cancel booking ${bookingRef}`,
        variant: "destructive"
      });
    } finally {
      setProcessingBooking(null);
      setCancelDialogOpen(null);
    }
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Payment Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Payment Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{paymentStatus}</Badge>;
    }
  };

  console.log(`Total pending bookings received: ${pendingBookings.length}`);
  console.log(`Valid pending bookings after filtering: ${validPendingBookings.length}`);

  if (validPendingBookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-medium mb-2">No Pending Bookings</h3>
            <p>All bookings for this event are confirmed or cancelled.</p>
            {pendingBookings.length > 0 && (
              <p className="text-sm mt-2 text-orange-600">
                Note: {pendingBookings.length} booking(s) were filtered out (likely cancelled or invalid)
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Pending Bookings ({validPendingBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Booking Ref</TableHead>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validPendingBookings.map((booking) => (
                  <TableRow key={booking.id} className="bg-yellow-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.guest_name || 'No name provided'}</div>
                        {booking.dietary_restrictions && (
                          <div className="text-sm text-orange-600">
                            Has dietary restrictions
                          </div>
                        )}
                        {booking.special_requests && (
                          <div className="text-sm text-blue-600">
                            Has special requests
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{booking.guest_email}</div>
                        {booking.guest_phone && (
                          <div className="text-sm text-gray-500">{booking.guest_phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{booking.booking_reference}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-gray-500">{booking.id.slice(0, 8)}...</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{booking.number_of_tickets}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">€{Number(booking.total_amount).toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(booking.payment_status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {format(new Date(booking.created_at), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(booking)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" disabled={processingBooking === booking.id}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <AlertDialog open={confirmDialogOpen === booking.id} onOpenChange={(open) => !open && setConfirmDialogOpen(null)}>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => {
                                  e.preventDefault();
                                  setConfirmDialogOpen(booking.id);
                                }}>
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Manually Confirm
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirm Booking?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will manually confirm booking {booking.booking_reference} for {booking.guest_name || 'this guest'} and mark the payment as paid. 
                                    The available spots will be updated automatically. The guest will receive a confirmation email. This action cannot be undone.
                                    <br />
                                    <span className="text-xs text-gray-500 mt-2 block">Booking ID: {booking.id}</span>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleConfirmBooking(booking.id, booking.booking_reference)}
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={processingBooking === booking.id}
                                  >
                                    Confirm Booking
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog open={cancelDialogOpen === booking.id} onOpenChange={(open) => !open && setCancelDialogOpen(null)}>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => {
                                  e.preventDefault();
                                  setCancelDialogOpen(booking.id);
                                }}>
                                  <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                  Cancel Booking
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will cancel booking {booking.booking_reference} for {booking.guest_name || 'this guest'}. 
                                    The guest will be notified automatically. This action cannot be undone.
                                    <br />
                                    <span className="text-xs text-gray-500 mt-2 block">Booking ID: {booking.id}</span>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleCancelBooking(booking.id, booking.booking_reference)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={processingBooking === booking.id}
                                  >
                                    Cancel Booking
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <DropdownMenuItem onClick={() => window.location.href = `mailto:${booking.guest_email}`}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            {booking.guest_phone && (
                              <DropdownMenuItem onClick={() => window.location.href = `tel:${booking.guest_phone}`}>
                                <Phone className="h-4 w-4 mr-2" />
                                Call
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AttendeeDetailsModal
        attendee={selectedAttendee}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onBookingUpdate={handleBookingUpdated}
      />
    </>
  );
};
