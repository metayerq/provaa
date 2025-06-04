import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  MoreVertical,
  Mail,
  Phone,
  Eye,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { AttendeeDetailsModal } from './AttendeeDetailsModal';

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
}

interface AttendeeTableProps {
  attendees: AttendeeData[];
  onBookingUpdate?: () => void;
}

export const AttendeeTable: React.FC<AttendeeTableProps> = ({ 
  attendees, 
  onBookingUpdate 
}) => {
  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const handleViewDetails = (attendee: AttendeeData) => {
    setSelectedAttendee(attendee);
    setIsModalOpen(true);
  };

  const handleContact = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleCall = (phone: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAttendee(null);
  };

  const handleBookingUpdated = () => {
    handleModalClose();
    if (onBookingUpdate) {
      onBookingUpdate();
    }
  };

  if (attendees.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <h3 className="text-lg font-medium mb-2">No attendees found</h3>
            <p>No attendees match your current search criteria.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Booking Ref</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Booked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{attendee.guest_name || 'No name provided'}</div>
                        {attendee.dietary_restrictions && (
                          <div className="text-sm text-orange-600">
                            Has dietary restrictions
                          </div>
                        )}
                        {attendee.special_requests && (
                          <div className="text-sm text-blue-600">
                            Has special requests
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{attendee.guest_email}</div>
                        {attendee.guest_phone && (
                          <div className="text-sm text-gray-500">{attendee.guest_phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{attendee.booking_reference}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{attendee.number_of_tickets}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">€{Number(attendee.total_amount).toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(attendee.status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {format(new Date(attendee.created_at), 'MMM dd, yyyy')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(attendee)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleContact(attendee.guest_email)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            {attendee.guest_phone && (
                              <DropdownMenuItem onClick={() => handleCall(attendee.guest_phone)}>
                                <Phone className="h-4 w-4 mr-2" />
                                Call
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleViewDetails(attendee)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Manage Booking
                            </DropdownMenuItem>
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
