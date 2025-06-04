import React from "react";
import ModernSearchBar from "@/components/search/ModernSearchBar";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  isMobile?: boolean;
}

const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch,
  isMobile = false
}: SearchBarProps) => {
  return (
    <ModernSearchBar
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      handleSearch={handleSearch}
      isMobile={isMobile}
      variant="navbar"
    />
  );
};

export default SearchBar;
