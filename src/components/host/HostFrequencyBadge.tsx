
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getFrequencyBadge } from '@/utils/hostFrequencyUtils';

interface HostFrequencyBadgeProps {
  averageFrequencyDays: number | null;
  size?: 'sm' | 'md' | 'lg';
}

export const HostFrequencyBadge: React.FC<HostFrequencyBadgeProps> = ({
  averageFrequencyDays,
  size = 'md'
}) => {
  const badge = getFrequencyBadge(averageFrequencyDays);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    green: 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <Badge 
      variant="outline" 
      className={`${sizeClasses[size]} ${colorClasses[badge.color]} font-medium border`}
    >
      <span className="mr-1">{badge.emoji}</span>
      {badge.label}
    </Badge>
  );
};
