
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const NavLinks = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden md:flex items-center space-x-8">
      <Link
        to="/events"
        className={cn(
          "text-white font-medium text-sm uppercase tracking-wide hover:text-gray-300 transition-colors",
          isActive("/events") && "border-b-2 border-white pb-1"
        )}
      >
        EXPERIENCES
      </Link>
      <Link
        to="/saved"
        className={cn(
          "text-white font-medium text-sm uppercase tracking-wide hover:text-gray-300 transition-colors",
          isActive("/saved") && "border-b-2 border-white pb-1"
        )}
      >
        SAVED
      </Link>
    </div>
  );
};

export default NavLinks;
