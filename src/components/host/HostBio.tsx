
import React from 'react';

interface HostBioProps {
  hostStory?: string;
}

export const HostBio: React.FC<HostBioProps> = ({ hostStory }) => {
  // Function to format bio text with proper line breaks
  const formatBioText = (text: string) => {
    return text.split('\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="prose max-w-none">
      {hostStory && (
        <div className="text-gray-700 leading-relaxed text-justify">
          {formatBioText(hostStory)}
        </div>
      )}
      {!hostStory && (
        <p className="text-gray-500 italic">
          This host hasn't shared their story yet.
        </p>
      )}
    </div>
  );
};
