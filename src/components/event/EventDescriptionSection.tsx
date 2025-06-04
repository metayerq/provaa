
import React from 'react';

interface EventDescriptionSectionProps {
  description?: string;
  ambianceDescription?: string;
}

export const EventDescriptionSection: React.FC<EventDescriptionSectionProps> = ({
  description,
  ambianceDescription
}) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">The Experience</h2>
      
      {/* Dynamic event description with text justification */}
      {description && (
        <p className="text-xl text-gray-800 leading-relaxed font-light mb-6 font-serif italic text-justify">
          {description.split('.')[0]}.
        </p>
      )}
      
      {/* Additional content with text justification */}
      <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4 mb-8">
        {description && description.split('.').length > 1 && (
          <p className="text-justify">
            {description.split('.').slice(1).join('.').trim()}
          </p>
        )}
        {ambianceDescription && (
          <p className="text-justify">
            {ambianceDescription}
          </p>
        )}
      </div>
    </div>
  );
};
