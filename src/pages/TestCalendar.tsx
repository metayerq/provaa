import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarPlus } from 'lucide-react';
import { useBookingActions } from '@/hooks/useBookingActions';
import { createSampleBooking, testCalendarUrlGeneration } from '@/utils/calendarUtils';
import Layout from '@/components/layout/Layout';

const TestCalendar: React.FC = () => {
  const { addToCalendar } = useBookingActions();

  const handleTestCalendar = () => {
    const sampleBooking = createSampleBooking();
    addToCalendar(sampleBooking);
  };

  const handleLogUrlTest = () => {
    testCalendarUrlGeneration();
  };

  const sampleBooking = createSampleBooking();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Calendar Integration Test
          </h1>
          <p className="text-gray-600">
            Test the "Add to Calendar" functionality with sample booking data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sample Booking Card */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{sampleBooking.event.title}</h3>
                <p className="text-gray-600">Booking Ref: {sampleBooking.booking_reference}</p>
              </div>
              
              <div className="space-y-2">
                <p><span className="font-medium">Date:</span> {sampleBooking.event.date}</p>
                <p><span className="font-medium">Time:</span> {sampleBooking.event.time}</p>
                <p><span className="font-medium">Location:</span> {sampleBooking.event.location.venue}, {sampleBooking.event.location.city}</p>
                <p><span className="font-medium">Tickets:</span> {sampleBooking.number_of_tickets}</p>
                <p><span className="font-medium">Total:</span> €{sampleBooking.total_amount}</p>
              </div>

              {sampleBooking.dietary_restrictions && (
                <p><span className="font-medium">Dietary:</span> {sampleBooking.dietary_restrictions}</p>
              )}
              
              {sampleBooking.special_requests && (
                <p><span className="font-medium">Special Requests:</span> {sampleBooking.special_requests}</p>
              )}
            </CardContent>
          </Card>

          {/* Test Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Button 
                  onClick={handleTestCalendar}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Test Add to Calendar
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  This will open Google Calendar with the event details pre-filled.
                </p>
              </div>

              <div>
                <Button 
                  onClick={handleLogUrlTest}
                  variant="outline"
                  className="w-full"
                >
                  Log URL to Console
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Check the browser console to see the generated URL.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Expected Behavior</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Click "Test Add to Calendar" button</li>
                <li>A new tab should open with Google Calendar</li>
                <li>The event form should be pre-filled with:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Event title: "Natural Wine Tasting Experience"</li>
                    <li>Date: June 15, 2025 at 7:30 PM</li>
                    <li>Duration: 2.5 hours (until 10:00 PM)</li>
                    <li>Location: "Urban Vineyard Lounge, Barcelona"</li>
                    <li>Description with booking reference, tickets, and special requests</li>
                  </ul>
                </li>
                <li>You should see a success toast notification</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TestCalendar; 