
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchSuggestion } from '@/types/search';

interface SearchSuggestionDropdownProps {
  suggestions: SearchSuggestion[];
  loading: boolean;
  query: string;
  selectedIndex: number;
  onClose: () => void;
  onSelect: (suggestion: SearchSuggestion) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const SearchSuggestionDropdown: React.FC<SearchSuggestionDropdownProps> = ({
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
        <span key={index} className="bg-yellow-200 text-yellow-800 font-medium">
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

  if (loading) {
    return (
      <div
        ref={dropdownRef}
        className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1"
        onKeyDown={onKeyDown}
      >
        <div className="p-4 text-center text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-2 text-sm">Searching...</p>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0 && query.length >= 2) {
    return (
      <div
        ref={dropdownRef}
        className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1"
        onKeyDown={onKeyDown}
      >
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">No results found for "{query}"</p>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  let currentIndex = 0;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-96 overflow-y-auto"
      onKeyDown={onKeyDown}
    >
      <div className="p-2">
        <div className="text-xs font-semibold text-gray-500 mb-2 px-2">
          🔍 Search Results
        </div>

        {/* Experiences */}
        {categorizedSuggestions.experiences.length > 0 && (
          <div className="mb-2">
            {categorizedSuggestions.experiences.map((suggestion) => {
              const isSelected = currentIndex === selectedIndex;
              currentIndex++;
              return (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 ${
                    isSelected ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{suggestion.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {highlightMatch(suggestion.title, query)}
                    </div>
                    {suggestion.subtitle && (
                      <div className="text-xs text-gray-500">{suggestion.subtitle}</div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    experience
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Hosts */}
        {categorizedSuggestions.hosts.length > 0 && (
          <div className="mb-2">
            {categorizedSuggestions.hosts.map((suggestion) => {
              const isSelected = currentIndex === selectedIndex;
              currentIndex++;
              return (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 ${
                    isSelected ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{suggestion.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {highlightMatch(suggestion.title, query)}
                    </div>
                    {suggestion.subtitle && (
                      <div className="text-xs text-gray-500">{suggestion.subtitle}</div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    host
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Guests */}
        {categorizedSuggestions.guests.length > 0 && (
          <div className="mb-2">
            {categorizedSuggestions.guests.map((suggestion) => {
              const isSelected = currentIndex === selectedIndex;
              currentIndex++;
              return (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 ${
                    isSelected ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{suggestion.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {highlightMatch(suggestion.title, query)}
                    </div>
                    {suggestion.subtitle && (
                      <div className="text-xs text-gray-500">{suggestion.subtitle}</div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    guest
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Locations */}
        {categorizedSuggestions.locations.length > 0 && (
          <div className="mb-2">
            {categorizedSuggestions.locations.map((suggestion) => {
              const isSelected = currentIndex === selectedIndex;
              currentIndex++;
              return (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 ${
                    isSelected ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{suggestion.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {highlightMatch(suggestion.title, query)}
                    </div>
                    {suggestion.subtitle && (
                      <div className="text-xs text-gray-500">{suggestion.subtitle}</div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    location
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Show more results option */}
        <div className="border-t pt-2 mt-2">
          <button
            onClick={() => {
              navigate(`/events?search=${encodeURIComponent(query)}`);
              onClose();
            }}
            className="w-full text-left px-3 py-2 rounded-md transition-colors text-sm text-emerald-600 hover:bg-emerald-50"
          >
            See all results for "{query}"
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestionDropdown;
