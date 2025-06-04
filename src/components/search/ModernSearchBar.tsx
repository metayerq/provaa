import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import ModernSearchDropdown from "./ModernSearchDropdown";
import { SearchSuggestion } from "@/types/search";
import { cn } from "@/lib/utils";

interface ModernSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  isMobile?: boolean;
  variant?: 'navbar' | 'standalone';
}

const ModernSearchBar: React.FC<ModernSearchBarProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch,
  isMobile = false,
  variant = 'navbar'
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
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
    setIsFocused(true);
    if (searchQuery.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
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

  const getSearchStyles = () => {
    if (variant === 'navbar') {
      return {
        container: cn(
          "relative group transition-all duration-300",
          isMobile ? "w-full" : "w-full max-w-lg"
        ),
        input: cn(
          "w-full pl-12 pr-6 py-4 text-white placeholder-white/70",
          "bg-white/10 border-2 border-transparent rounded-full",
          "backdrop-filter backdrop-blur-lg transition-all duration-300 ease-out",
          "focus:bg-white/15 focus:border-white/30 focus:outline-none",
          "focus:transform focus:translate-y-[-2px] focus:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
          "hover:bg-white/12 hover:backdrop-blur-xl",
          isFocused && "bg-white/15 border-white/30 transform translate-y-[-2px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        ),
        icon: "absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5 transition-colors duration-200"
      };
    } else {
      return {
        container: "relative group transition-all duration-300 w-full max-w-2xl",
        input: cn(
          "w-full pl-12 pr-6 py-4 text-gray-900 placeholder-gray-500",
          "bg-white border-2 border-gray-200 rounded-full",
          "shadow-lg transition-all duration-300 ease-out",
          "focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20",
          "focus:transform focus:translate-y-[-2px] focus:shadow-xl",
          "hover:border-gray-300 hover:shadow-xl"
        ),
        icon: "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
      };
    }
  };

  const styles = getSearchStyles();

  return (
    <form onSubmit={handleFormSubmit} className={styles.container}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
          <Search className={styles.icon} />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search experiences, hosts, locations..."
          className={styles.input}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        
        {showSuggestions && (
          <ModernSearchDropdown
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

export default ModernSearchBar; 