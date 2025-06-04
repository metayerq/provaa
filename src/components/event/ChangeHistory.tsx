
import React from 'react';
import { Label } from '@/components/ui/label';
import { Clock, DollarSign, Users, Calendar } from 'lucide-react';

interface ChangeHistoryProps {
  eventId: string;
}

const ChangeHistory: React.FC<ChangeHistoryProps> = ({ eventId }) => {
  // This would typically fetch real change history from the database
  // For now, showing mock data
  const changes = [
    {
      id: 1,
      timestamp: '2024-05-20 14:30',
      action: 'Price updated',
      details: 'from €60 to €65',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 2,
      timestamp: '2024-05-18 16:15',
      action: 'Capacity increased',
      details: 'from 10 to 12 spots',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 3,
      timestamp: '2024-05-15 10:00',
      action: 'Event created',
      details: 'Initial setup completed',
      icon: Calendar,
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Change History</Label>
      
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <div className="space-y-4">
          {changes.map((change) => {
            const IconComponent = change.icon;
            return (
              <div key={change.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full bg-white ${change.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{change.action}</span>
                    <span className="text-sm text-gray-500">{change.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{change.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChangeHistory;
