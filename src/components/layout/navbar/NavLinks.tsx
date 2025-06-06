import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, FileText, Users, Briefcase } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const NavLinks = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const aboutPages = [
    { 
      name: "Our Story", 
      path: "/our-story", 
      icon: FileText,
      description: "Learn about our mission and journey"
    },
    { 
      name: "We're Hiring", 
      path: "/careers", 
      icon: Users,
      description: "Join our growing team"
    },
    { 
      name: "Press Kit", 
      path: "/press-kit", 
      icon: Briefcase,
      description: "Media resources and company info"
    }
  ];

  return (
    <div className="hidden md:flex items-center space-x-8">
      {/* ABOUT Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="text-white font-medium text-sm uppercase tracking-wide hover:text-gray-300 hover:bg-gray-800 flex items-center space-x-1"
          >
            <span>ABOUT</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="bg-white border-gray-200 mt-2 w-80 p-0" 
          align="center"
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Provaa</h3>
            <div className="space-y-2">
              {aboutPages.map((page) => (
                <DropdownMenuItem key={page.name} asChild className="p-0">
                  <Link 
                    to={page.path}
                    className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer w-full"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-emerald-50 rounded-lg mr-3 flex-shrink-0">
                      <page.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{page.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{page.description}</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

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
