import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";
import AuthButtons from "./AuthButtons";

interface MobileMenuProps {
  isMenuOpen: boolean;
}

const MobileMenu = ({ isMenuOpen }: MobileMenuProps) => {
  const { user } = useAuth();

  if (!isMenuOpen) {
    return null;
  }

  return (
    <div className="md:hidden py-4 border-t border-gray-700">
      <div className="flex flex-col space-y-4 px-4">
        <NavLinks />
        
        {user ? (
          <UserMenu />
        ) : (
          <AuthButtons isMobile={true} />
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
