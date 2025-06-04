
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface HostAvatarProps {
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const HostAvatar: React.FC<HostAvatarProps> = ({
  name,
  image,
  size = 'md',
  className = ''
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {image ? (
        <AvatarImage 
          src={image} 
          alt={name}
          className="object-cover"
        />
      ) : null}
      <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};
