
import React from 'react';

interface UserStatusIndicatorProps {
  userEmail?: string;
}

export const UserStatusIndicator: React.FC<UserStatusIndicatorProps> = ({ userEmail }) => {
  if (!userEmail) return null;

  return (
    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
      <div className="flex items-center gap-2 text-sm text-emerald-700">
        <span>✓</span>
        <span>Logged in as {userEmail}</span>
      </div>
    </div>
  );
};
