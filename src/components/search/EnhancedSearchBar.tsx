
import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import SearchSuggestionDropdown from "./SearchSuggestionDropdown";
import { SearchSuggestion } from "@/types/search";

interface EnhancedSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  isMobile?: boolean;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch,
  isMobile = false
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const { suggestions, loading } = useSearchSuggestions(searchQuery);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (searchQuery.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch(e);
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
          navigate(selectedSuggestion.url);
        } else {
          handleSearch(e);
        }
        break;
      
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    handleSearch(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className={isMobile ? "mb-4" : "w-full relative"}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search for an experience, host, or location"
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border-0 text-white placeholder-gray-400 focus:bg-gray-700 focus:ring-2 focus:ring-white/20 transition-all duration-200 rounded-md"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        
        {showSuggestions && (
          <SearchSuggestionDropdown
            suggestions={suggestions}
            loading={loading}
            query={searchQuery}
            selectedIndex={selectedIndex}
            onClose={() => setShowSuggestions(false)}
            onSelect={handleSuggestionSelect}
            onKeyDown={handleKeyDown}
          />
        )}
      </div>
    </form>
  );
};

export default EnhancedSearchBar;
