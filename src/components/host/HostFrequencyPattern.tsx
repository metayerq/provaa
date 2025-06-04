
import React from 'react';
import { formatHostingFrequency, getFrequencyBadge, getUrgencyMessage, formatLastEventDate } from '@/utils/hostFrequencyUtils';

interface HostFrequencyData {
  average_frequency_days: number | null;
  events_per_year: number | null;
  last_event_date: string | null;
  completed_events_count: number;
}

interface HostFrequencyPatternProps {
  hasCompletedEvents: boolean;
  frequencyLoading: boolean;
  frequencyData: HostFrequencyData | null;
}

export const HostFrequencyPattern: React.FC<HostFrequencyPatternProps> = ({
  hasCompletedEvents,
  frequencyLoading,
  frequencyData
}) => {
  if (!hasCompletedEvents) return null;

  const frequencyBadge = hasCompletedEvents 
    ? getFrequencyBadge(frequencyData?.average_frequency_days || null)
    : { emoji: "🆕", label: "NEW HOST", color: "blue" };

  const urgencyMessage = getUrgencyMessage(
    frequencyData?.average_frequency_days || null,
    frequencyData?.last_event_date || null
  );

  return (
    <div className="border-t border-gray-200 pt-3 mb-4">
      <div className="flex items-center gap-3 text-sm text-gray-600" style={{ fontSize: '0.95rem' }}>
        {!frequencyLoading && frequencyData && (
          <>
            <div className="flex items-center gap-1">
              <span className="text-base">{frequencyBadge.emoji}</span>
              <span className="font-medium text-gray-700">{frequencyBadge.label.toLowerCase()}</span>
            </div>
            <span>•</span>
            <span>Hosts {formatHostingFrequency(frequencyData.average_frequency_days)}</span>
            {frequencyData.events_per_year && (
              <>
                <span>•</span>
                <span>({frequencyData.events_per_year} events/year)</span>
              </>
            )}
            <span>•</span>
            <span>Last event {formatLastEventDate(frequencyData.last_event_date)}</span>
          </>
        )}
        {frequencyLoading && <span>Loading hosting pattern...</span>}
      </div>
      {urgencyMessage && (
        <div className="mt-2 text-sm text-orange-600 font-medium">
          {urgencyMessage}
        </div>
      )}
    </div>
  );
};
