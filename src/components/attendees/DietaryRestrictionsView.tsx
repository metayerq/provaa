
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Utensils, Download, Users } from 'lucide-react';

interface AttendeeData {
  id: string;
  guest_name: string;
  guest_email: string;
  number_of_tickets: number;
  dietary_restrictions?: string;
}

interface DietaryRestrictionsViewProps {
  attendees: AttendeeData[];
}

export const DietaryRestrictionsView: React.FC<DietaryRestrictionsViewProps> = ({ attendees }) => {
  const attendeesWithRestrictions = attendees.filter(attendee => attendee.dietary_restrictions);

  // Parse and categorize dietary restrictions
  const restrictionCounts = attendeesWithRestrictions.reduce((acc, attendee) => {
    const restrictions = attendee.dietary_restrictions?.toLowerCase() || '';
    
    // Common dietary restrictions to check for
    const categories = {
      'vegetarian': /vegetarian|veggie/i,
      'vegan': /vegan/i,
      'gluten-free': /gluten.?free|celiac|coeliac/i,
      'dairy-free': /dairy.?free|lactose.?intolerant|no.?dairy/i,
      'nut allergies': /nut.?allergy|nut.?free|peanut|almond|cashew/i,
      'pescatarian': /pescatarian|fish.?only/i,
      'halal': /halal/i,
      'kosher': /kosher/i,
      'shellfish allergy': /shellfish|seafood.?allergy/i,
      'other allergies': /allergy|allergic/i
    };

    Object.entries(categories).forEach(([category, regex]) => {
      if (regex.test(restrictions)) {
        if (!acc[category]) {
          acc[category] = { count: 0, attendees: [] };
        }
        acc[category].count += attendee.number_of_tickets;
        acc[category].attendees.push(attendee);
      }
    });

    return acc;
  }, {} as Record<string, { count: number; attendees: AttendeeData[] }>);

  if (attendeesWithRestrictions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <Utensils className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No Dietary Restrictions</h3>
            <p>None of your confirmed attendees have specified dietary restrictions.</p>
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
            <Utensils className="h-5 w-5 text-orange-500" />
            Dietary Requirements Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{attendeesWithRestrictions.length}</div>
              <div className="text-sm text-gray-500">Guests with restrictions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {attendeesWithRestrictions.reduce((sum, attendee) => sum + attendee.number_of_tickets, 0)}
              </div>
              <div className="text-sm text-gray-500">Total restricted tickets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {attendees.length > 0 ? ((attendeesWithRestrictions.length / attendees.length) * 100).toFixed(0) : 0}%
              </div>
              <div className="text-sm text-gray-500">Of all attendees</div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export for Catering
          </Button>
        </CardContent>
      </Card>

      {/* Categorized Restrictions */}
      {Object.keys(restrictionCounts).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Restriction Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.entries(restrictionCounts).map(([category, data]) => (
                <div key={category} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="capitalize">
                      {category}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {data.count} ticket{data.count !== 1 ? 's' : ''} 
                      ({data.attendees.length} guest{data.attendees.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed List */}
      <Card>
        <CardHeader>
          <CardTitle>All Dietary Restrictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendeesWithRestrictions.map(attendee => (
              <div key={attendee.id} className="border-l-4 border-orange-400 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{attendee.guest_name}</div>
                    <div className="text-sm text-gray-500">{attendee.guest_email}</div>
                  </div>
                  <Badge variant="outline">
                    {attendee.number_of_tickets} ticket{attendee.number_of_tickets !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="bg-orange-100 border border-orange-200 rounded p-3">
                  <div className="text-sm font-medium text-orange-800 mb-1">Dietary Restrictions:</div>
                  <div className="text-sm text-orange-700">{attendee.dietary_restrictions}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
