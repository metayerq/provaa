import React, { useState, useEffect, useRef } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import ModernSearchDropdown from "@/components/search/ModernSearchDropdown";
import { SearchSuggestion } from "@/types/search";

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const MobileSearchOverlay = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  handleSearch
}: MobileSearchOverlayProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const { suggestions, loading } = useSearchSuggestions(searchQuery);

  // Popular searches (could be fetched from backend)
  const popularSearches = [
    "Wine tasting",
    "Cooking classes",
    "Food tours",
    "Cheese making",
    "Coffee cupping"
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add to search history
      const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      handleSearch(e);
      onClose();
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    navigate(`/events?search=${encodeURIComponent(query)}`);
    onClose();
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    // Add to search history
    const newHistory = [suggestion.title, ...searchHistory.filter(item => item !== suggestion.title)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    
    navigate(suggestion.url);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearchSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const selectedSuggestion = suggestions[selectedIndex];
          handleSuggestionSelect(selectedSuggestion);
        } else {
          handleSearchSubmit(e);
        }
        break;
      
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        onClose();
        break;
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b">
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search experiences, hosts, or locations"
                className="w-full pl-12 pr-4 py-3 text-lg border-0 focus:ring-2 focus:ring-emerald-500 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
              
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2">
                  <ModernSearchDropdown
                    suggestions={suggestions}
                    loading={loading}
                    query={searchQuery}
                    selectedIndex={selectedIndex}
                    onClose={() => setShowSuggestions(false)}
                    onSelect={handleSuggestionSelect}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              )}
            </div>
          </form>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-12 w-12 p-0 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Search Content - only show when not showing suggestions */}
        {!showSuggestions && (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Recent Searches */}
            {searchHistory.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    Recent Searches
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-2">
                  {searchHistory.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(query)}
                      className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{query}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-500" />
                Popular Searches
              </h3>
              <div className="space-y-2">
                {popularSearches.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(query)}
                    className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-gray-900">{query}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Browse</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    navigate('/events');
                    onClose();
                  }}
                  className="p-4 bg-emerald-50 rounded-lg text-center hover:bg-emerald-100 transition-colors"
                >
                  <div className="text-emerald-600 font-medium">All Experiences</div>
                  <div className="text-sm text-emerald-500 mt-1">Browse everything</div>
                </button>
                <button
                  onClick={() => {
                    navigate('/saved');
                    onClose();
                  }}
                  className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"
                >
                  <div className="text-gray-600 font-medium">Saved Events</div>
                  <div className="text-sm text-gray-500 mt-1">Your favorites</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSearchOverlay;
