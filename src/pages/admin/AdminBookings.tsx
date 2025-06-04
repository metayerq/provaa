
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { Download, Eye, Mail, RefreshCw, FileText } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminBookings = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings', statusFilter, dateFrom, dateTo],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          events (
            id,
            title,
            date,
            time
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (dateFrom) {
        query = query.gte('created_at', dateFrom);
      }

      if (dateTo) {
        query = query.lte('created_at', dateTo + 'T23:59:59');
      }

      const { data } = await query;
      return data || [];
    },
  });

  const refundMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          payment_status: 'refunded',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', bookingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Refund processed",
        description: "The booking has been refunded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process refund",
        variant: "destructive",
      });
    },
  });

  const totalRevenue = React.useMemo(() => {
    if (!bookings) return 0;
    return bookings
      .filter(booking => booking.status === 'confirmed' && booking.payment_status === 'paid')
      .reduce((sum, booking) => sum + Number(booking.total_amount), 0);
  }, [bookings]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const exportToCSV = () => {
    if (!bookings) return;

    const headers = ['Booking Ref', 'Event', 'Guest Name', 'Email', 'Amount', 'Date', 'Status', 'Payment Status'];
    const csvContent = [
      headers.join(','),
      ...bookings.map(booking => [
        booking.booking_reference,
        `"${booking.events?.title || 'Unknown Event'}"`,
        `"${booking.guest_name || 'N/A'}"`,
        booking.guest_email || 'N/A',
        `€${booking.total_amount}`,
        format(new Date(booking.created_at), 'yyyy-MM-dd'),
        booking.status,
        booking.payment_status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600">View and manage all bookings</p>
        </div>
        <Button onClick={exportToCSV} disabled={!bookings}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">€{totalRevenue.toFixed(2)}</div>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{bookings?.length || 0}</div>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {bookings?.filter(b => b.status === 'confirmed').length || 0}
            </div>
            <p className="text-sm text-gray-600">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {bookings?.filter(b => b.status === 'cancelled').length || 0}
            </div>
            <p className="text-sm text-gray-600">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="From date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <Input
              type="date"
              placeholder="To date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <Button 
              variant="outline" 
              onClick={() => {
                setStatusFilter("all");
                setDateFrom("");
                setDateTo("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings ({bookings?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading bookings...</div>
            </div>
          ) : !bookings || bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No bookings found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking Ref</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings?.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-sm">{booking.booking_reference}</TableCell>
                      <TableCell className="max-w-xs">
                        <Link 
                          to={`/events/${booking.events?.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline truncate block"
                        >
                          {booking.events?.title || 'Unknown Event'}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.guest_name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{booking.guest_email || 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell>€{booking.total_amount}</TableCell>
                      <TableCell>
                        {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(booking.payment_status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {/* View Event */}
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/events/${booking.events?.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          
                          {/* Contact Guest */}
                          {booking.guest_email && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={`mailto:${booking.guest_email}?subject=Regarding your booking ${booking.booking_reference}`}>
                                <Mail className="h-4 w-4" />
                              </a>
                            </Button>
                          )}

                          {/* View Details */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedBooking(booking)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Booking Details</DialogTitle>
                                <DialogDescription>
                                  Full details for booking {booking.booking_reference}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4 py-4">
                                <div>
                                  <strong>Event:</strong> {booking.events?.title}
                                </div>
                                <div>
                                  <strong>Date:</strong> {booking.events?.date} at {booking.events?.time}
                                </div>
                                <div>
                                  <strong>Guest:</strong> {booking.guest_name}
                                </div>
                                <div>
                                  <strong>Email:</strong> {booking.guest_email}
                                </div>
                                <div>
                                  <strong>Phone:</strong> {booking.guest_phone || 'N/A'}
                                </div>
                                <div>
                                  <strong>Tickets:</strong> {booking.number_of_tickets}
                                </div>
                                <div>
                                  <strong>Total:</strong> €{booking.total_amount}
                                </div>
                                <div>
                                  <strong>Status:</strong> {booking.status}
                                </div>
                                {booking.special_requests && (
                                  <div className="col-span-2">
                                    <strong>Special Requests:</strong> {booking.special_requests}
                                  </div>
                                )}
                                {booking.dietary_restrictions && (
                                  <div className="col-span-2">
                                    <strong>Dietary Restrictions:</strong> {booking.dietary_restrictions}
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Process Refund */}
                          {booking.status === 'confirmed' && booking.payment_status === 'paid' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Process Refund</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to process a refund for booking {booking.booking_reference}? 
                                    This will cancel the booking and mark the payment as refunded.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => refundMutation.mutate(booking.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Process Refund
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;
