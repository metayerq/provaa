
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  User, 
  MessageSquare,
  Utensils,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
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
  created_at: string;
  dietary_restrictions?: string;
  special_requests?: string;
  payment_status?: string;
}

interface AttendeeDetailsModalProps {
  attendee: AttendeeData | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingUpdate?: () => void;
}

export const AttendeeDetailsModal: React.FC<AttendeeDetailsModalProps> = ({
  attendee,
  isOpen,
  onClose,
  onBookingUpdate
}) => {
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const { toast } = useToast();

  if (!attendee) return null;

  const handleStatusChange = async (newStatus: string) => {
    setIsProcessing(true);
    try {
      const updates: any = { status: newStatus };
      
      if (newStatus === 'confirmed') {
        updates.payment_status = 'paid';
      } else if (newStatus === 'cancelled') {
        updates.cancelled_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', attendee.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}`,
      });

      if (onBookingUpdate) {
        onBookingUpdate();
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update booking status",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setConfirmDialogOpen(false);
      setCancelDialogOpen(false);
    }
  };

  const handleRefund = async () => {
    setIsProcessing(true);
    try {
      // This would typically integrate with Stripe for actual refunds
      // For now, we'll just update the status
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', attendee.id);

      if (error) throw error;

      toast({
        title: "Refund Processed",
        description: "The booking has been cancelled and marked for refund",
      });

      if (onBookingUpdate) {
        onBookingUpdate();
      }
    } catch (error: any) {
      console.error('Error processing refund:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process refund",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setRefundDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Payment</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-500" />
            {attendee.guest_name || 'Guest Details'}
            {getStatusBadge(attendee.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Status Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              Booking Status
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">Booking Status</div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(attendee.status)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Payment Status</div>
                <div className="flex items-center gap-2">
                  {getPaymentStatusBadge(attendee.payment_status || 'unknown')}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{attendee.guest_email}</span>
              </div>
              {attendee.guest_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{attendee.guest_phone}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Booking Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Booking Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Booking Reference</div>
                <div className="font-mono">{attendee.booking_reference}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Number of Tickets</div>
                <div className="font-semibold">{attendee.number_of_tickets}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Amount</div>
                <div className="font-semibold">€{Number(attendee.total_amount).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Booking Date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{format(new Date(attendee.created_at), 'MMM dd, yyyy HH:mm')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dietary Restrictions */}
          {attendee.dietary_restrictions && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-orange-500" />
                  Dietary Restrictions
                </h3>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800">{attendee.dietary_restrictions}</p>
                </div>
              </div>
            </>
          )}

          {/* Special Requests */}
          {attendee.special_requests && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Special Requests
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">{attendee.special_requests}</p>
                </div>
              </div>
            </>
          )}

          {/* Host Notes Section */}
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-3">Host Notes</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="notes">Private notes about this booking</Label>
                <Textarea
                  id="notes"
                  placeholder="Add private notes about this guest or booking..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Booking Actions</h3>
            
            {/* Quick Actions Row */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.href = `mailto:${attendee.guest_email}`}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              {attendee.guest_phone && (
                <Button
                  variant="outline"
                  onClick={() => window.location.href = `tel:${attendee.guest_phone}`}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Guest
                </Button>
              )}
            </div>

            {/* Status Change Actions */}
            {attendee.status === 'pending' && (
              <div className="flex flex-wrap gap-2">
                <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Booking
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Booking?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will manually confirm the booking for {attendee.guest_name || 'this guest'} and mark the payment as paid. 
                        The guest will receive a confirmation email. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleStatusChange('confirmed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Confirm Booking
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={isProcessing}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Booking
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will cancel the booking for {attendee.guest_name || 'this guest'}. 
                        The guest will be notified automatically. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleStatusChange('cancelled')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Cancel Booking
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {attendee.status === 'confirmed' && (
              <div className="flex flex-wrap gap-2">
                <AlertDialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={isProcessing}
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Process Refund
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Process Refund?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will cancel the booking and process a refund of €{Number(attendee.total_amount).toFixed(2)} for {attendee.guest_name || 'this guest'}. 
                        The guest will be notified automatically. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleRefund}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Process Refund
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end pt-4">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
