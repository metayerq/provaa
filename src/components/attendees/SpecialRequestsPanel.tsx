
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, CheckCircle2, Clock } from 'lucide-react';

interface AttendeeData {
  id: string;
  guest_name: string;
  guest_email: string;
  number_of_tickets: number;
  special_requests?: string;
}

interface SpecialRequestsPanelProps {
  attendees: AttendeeData[];
}

export const SpecialRequestsPanel: React.FC<SpecialRequestsPanelProps> = ({ attendees }) => {
  const attendeesWithRequests = attendees.filter(attendee => attendee.special_requests);

  if (attendeesWithRequests.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No Special Requests</h3>
            <p>None of your confirmed attendees have submitted special requests.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Special Requests Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{attendeesWithRequests.length}</div>
              <div className="text-sm text-gray-500">Guests with requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {attendeesWithRequests.reduce((sum, attendee) => sum + attendee.number_of_tickets, 0)}
              </div>
              <div className="text-sm text-gray-500">Total tickets with requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {attendees.length > 0 ? ((attendeesWithRequests.length / attendees.length) * 100).toFixed(0) : 0}%
              </div>
              <div className="text-sm text-gray-500">Of all attendees</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Requests List */}
      <div className="space-y-4">
        {attendeesWithRequests.map(attendee => (
          <Card key={attendee.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <div className="font-medium">{attendee.guest_name}</div>
                      <div className="text-sm text-gray-500">{attendee.guest_email}</div>
                    </div>
                    <Badge variant="secondary">
                      {attendee.number_of_tickets} ticket{attendee.number_of_tickets !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="text-sm font-medium text-blue-800 mb-2">Special Request:</div>
                    <div className="text-sm text-blue-700">{attendee.special_requests}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Mark as Pending
                </Button>
                <Button size="sm" variant="outline">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Handled
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.location.href = `mailto:${attendee.guest_email}`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
