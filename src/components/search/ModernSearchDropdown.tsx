import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, Target, ArrowRight } from 'lucide-react';
import { SearchSuggestion } from '@/types/search';
import { cn } from '@/lib/utils';

interface ModernSearchDropdownProps {
  suggestions: SearchSuggestion[];
  loading: boolean;
  query: string;
  selectedIndex: number;
  onClose: () => void;
  onSelect: (suggestion: SearchSuggestion) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const ModernSearchDropdown: React.FC<ModernSearchDropdownProps> = ({
  suggestions,
  loading,
  query,
  selectedIndex,
  onClose,
  onSelect,
  onKeyDown
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-emerald-100 text-emerald-800 font-semibold rounded px-1">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSelect(suggestion);
    navigate(suggestion.url);
  };

  const categorizedSuggestions = {
    experiences: suggestions.filter(s => s.type === 'experience'),
    hosts: suggestions.filter(s => s.type === 'host'),
    guests: suggestions.filter(s => s.type === 'guest'),
    locations: suggestions.filter(s => s.type === 'location')
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'experiences':
        return <Target className="h-4 w-4 text-emerald-600" />;
      case 'hosts':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'locations':
        return <MapPin className="h-4 w-4 text-purple-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSectionTitle = (type: string) => {
    switch (type) {
      case 'experiences':
        return 'Experiences';
      case 'hosts':
        return 'Hosts';
      case 'guests':
        return 'Guests';
      case 'locations':
        return 'Locations';
      default:
        return 'Results';
    }
  };

  const getResultTypeColor = (type: string) => {
    switch (type) {
      case 'experience':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'host':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'guest':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'location':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div
        ref={dropdownRef}
        className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-50 mt-2 search-dropdown-enter search-dropdown-enter-active"
        onKeyDown={onKeyDown}
      >
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent"></div>
          </div>
          <p className="text-gray-600 font-medium">Searching...</p>
          <p className="text-sm text-gray-400 mt-1">Finding the best matches for you</p>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0 && query.length >= 2) {
    return (
      <div
        ref={dropdownRef}
        className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-50 mt-2 search-dropdown-enter search-dropdown-enter-active"
        onKeyDown={onKeyDown}
      >
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
            <Target className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">No results found</p>
          <p className="text-sm text-gray-400 mt-1">Try searching for something else</p>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  let currentIndex = 0;

  const renderSection = (type: keyof typeof categorizedSuggestions) => {
    const sectionSuggestions = categorizedSuggestions[type];
    if (sectionSuggestions.length === 0) return null;

    return (
      <div key={type} className="mb-1 last:mb-0">
        {/* Section Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          {getSectionIcon(type)}
          <h3 className="text-sm font-semibold text-gray-700">
            {getSectionTitle(type)} 🎯
          </h3>
          <span className="ml-auto text-xs text-gray-400 bg-white px-2 py-1 rounded-full">
            {sectionSuggestions.length}
          </span>
        </div>

        {/* Section Items */}
        <div className="py-2">
          {sectionSuggestions.map((suggestion) => {
            const isSelected = currentIndex === selectedIndex;
            currentIndex++;
            return (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-4 group",
                  "hover:bg-gray-50 hover:transform hover:translate-x-1",
                  isSelected && "bg-emerald-50 border-l-4 border-emerald-500 transform translate-x-1"
                )}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <span className="text-xl">{suggestion.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate mb-1">
                    {highlightMatch(suggestion.title, query)}
                  </div>
                  {suggestion.subtitle && (
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      {type === 'experiences' && (
                        <span className="inline-flex items-center gap-1">
                          📅 {suggestion.subtitle.split('•')[0]?.trim()}
                          {suggestion.subtitle.includes('•') && (
                            <>
                              <span className="mx-1">•</span>
                              📍 {suggestion.subtitle.split('•')[1]?.trim()}
                            </>
                          )}
                        </span>
                      )}
                      {type === 'hosts' && (
                        <span className="inline-flex items-center gap-1">
                          👤 {suggestion.subtitle}
                        </span>
                      )}
                      {type === 'locations' && (
                        <span className="inline-flex items-center gap-1">
                          📍 {suggestion.subtitle}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Result Type Badge */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full border font-medium",
                    getResultTypeColor(suggestion.type)
                  )}>
                    {suggestion.type}
                  </span>
                  <ArrowRight className={cn(
                    "h-4 w-4 text-gray-400 transition-all duration-200",
                    "group-hover:text-emerald-600 group-hover:transform group-hover:translate-x-1",
                    isSelected && "text-emerald-600 transform translate-x-1"
                  )} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-50 mt-2 max-h-[500px] overflow-y-auto search-dropdown-enter search-dropdown-enter-active border border-gray-100"
      onKeyDown={onKeyDown}
    >
      <div className="py-2">
        {/* Render sections in order */}
        {renderSection('experiences')}
        {renderSection('hosts')}
        {renderSection('guests')}
        {renderSection('locations')}

        {/* See all results */}
        <div className="border-t border-gray-100 mt-2 pt-2">
          <button
            onClick={() => {
              navigate(`/events?search=${encodeURIComponent(query)}`);
              onClose();
            }}
            className="w-full text-left px-4 py-3 transition-all duration-200 text-emerald-600 hover:bg-emerald-50 hover:transform hover:translate-x-1 flex items-center justify-between group"
          >
            <span className="font-medium">See all results for "{query}"</span>
            <ArrowRight className="h-4 w-4 text-emerald-600 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernSearchDropdown; 