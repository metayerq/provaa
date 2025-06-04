import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";
import AuthButtons from "./AuthButtons";
import LocationSelector from "./LocationSelector";
import MobileSearchOverlay from "./MobileSearchOverlay";
import EnhancedMobileMenu from "./EnhancedMobileMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <nav className="bg-black text-white fixed top-0 w-full z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Location */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link to="/" className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Provaa</h1>
              </Link>
              <div className="flex items-center">
                <LocationSelector />
              </div>
            </div>

            {/* Desktop Navigation - Empty center, everything moved to right */}
            <div className="hidden md:flex items-center flex-1">
              {/* Empty flex space to push everything to the right */}
            </div>

            {/* Right Section - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              {/* EXPERIENCES Button */}
              <Button
                variant="ghost"
                className="text-white font-medium text-sm uppercase tracking-wide hover:text-gray-300 hover:bg-gray-800"
                onClick={() => navigate('/events')}
              >
                EXPERIENCES
              </Button>

              {!user && (
                <Link
                  to="/create-event"
                  className="text-white font-medium text-sm uppercase tracking-wide hover:text-gray-300 transition-colors"
                >
                  I'M A HOST
                </Link>
              )}
              
              {user ? (
                <UserMenu />
              ) : (
                <AuthButtons />
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Search Icon */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-gray-300 hover:bg-gray-800 h-12 w-12 p-0"
              >
                <Search className="h-6 w-6" />
                <span className="sr-only">Search</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                className="text-white hover:text-gray-300 hover:bg-gray-800 h-12 w-12 p-0"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* Enhanced Mobile Menu */}
      <EnhancedMobileMenu
        isMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;
