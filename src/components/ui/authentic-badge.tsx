
import React from 'react';

interface AuthenticBadgeProps {
  children?: React.ReactNode;
  className?: string;
}

const AuthenticBadge: React.FC<AuthenticBadgeProps> = ({ className = '' }) => {
  return (
    <span className={`locally-sourced-badge ${className}`}>
      LOCALLY SOURCED
    </span>
  );
};

export default AuthenticBadge;
