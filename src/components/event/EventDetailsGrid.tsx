
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Languages, Accessibility, Utensils, MapPin, Shield } from 'lucide-react';

interface EventDetailsGridProps {
  duration: string;
  capacity: number;
  languages?: string[];
  accessibilityInfo?: string;
  dietaryOptions?: string[];
  meetingPointDetails?: string;
  cancellationPolicy?: string;
  dressCode?: string;
}

export const EventDetailsGrid: React.FC<EventDetailsGridProps> = ({
  duration,
  capacity,
  languages = [],
  accessibilityInfo,
  dietaryOptions = [],
  meetingPointDetails,
  cancellationPolicy,
  dressCode,
}) => {
  const details = [
    {
      icon: Clock,
      label: 'Duration',
      value: duration,
    },
    {
      icon: Users,
      label: 'Group Size',
      value: `Up to ${capacity} guests`,
    },
    {
      icon: Languages,
      label: 'Languages',
      value: languages.length > 0 ? languages.join(', ') : 'English',
    },
    {
      icon: Accessibility,
      label: 'Accessibility',
      value: accessibilityInfo || 'Ground floor',
    },
    {
      icon: Utensils,
      label: 'Dietary Options',
      value: dietaryOptions.length > 0 ? dietaryOptions.join(', ') : 'Standard menu',
    },
    {
      icon: Shield,
      label: 'Cancellation',
      value: cancellationPolicy || '48h notice',
    },
  ];

  if (dressCode) {
    details.push({
      icon: Users,
      label: 'Dress Code',
      value: dressCode,
    });
  }

  if (meetingPointDetails) {
    details.push({
      icon: MapPin,
      label: 'Meeting Point',
      value: meetingPointDetails,
    });
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {details.map((detail, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <detail.icon className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">{detail.label}</p>
                  <p className="text-gray-600 text-sm mt-1">{detail.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
