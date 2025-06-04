
import React from 'react';
import { BadgeCheck } from 'lucide-react';

interface Host {
  id: string;
  name: string;
  image?: string;
  credentials?: string;
}

interface HostHeaderProps {
  host: Host;
  hasCompletedEvents: boolean;
}

export const HostHeader: React.FC<HostHeaderProps> = ({ host, hasCompletedEvents }) => {
  return (
    <div className="flex gap-6 mb-6">
      {/* Large avatar */}
      <div className="w-[120px] h-[120px] rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
        {host.image ? (
          <img
            src={`${host.image}?auto=format&fit=crop&w=240&h=240`}
            alt={host.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold text-3xl">
            {host.name.charAt(0)}
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-2xl font-bold text-gray-900">{host.name}</h3>
          {/* Verified badge for hosts with completed events */}
          {hasCompletedEvents && (
            <BadgeCheck className="h-6 w-6 text-emerald-600" />
          )}
        </div>
        
        {/* Credentials */}
        {host.credentials && (
          <p className="text-emerald-600 font-medium mb-3">
            {host.credentials}
          </p>
        )}
      </div>
    </div>
  );
};
