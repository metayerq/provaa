
import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MapPin, User, Calendar, Building } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const ExploreDropdown = () => {
  const categories = [
    { 
      name: "Cities", 
      path: "/events?groupBy=city", 
      icon: MapPin,
      count: "12+",
      description: "Explore culinary scenes across different cities"
    },
    { 
      name: "Hosts", 
      path: "/events?groupBy=host", 
      icon: User,
      count: "50+",
      description: "Meet passionate food creators and chefs"
    },
    { 
      name: "Experiences", 
      path: "/events?groupBy=type", 
      icon: Calendar,
      count: "100+",
      description: "From tastings to cooking classes"
    },
    { 
      name: "Venues", 
      path: "/events?groupBy=venue", 
      icon: Building,
      count: "30+",
      description: "Unique locations for unforgettable meals"
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-white font-medium text-sm uppercase tracking-wide hover:text-gray-300 hover:bg-gray-800 flex items-center space-x-1"
        >
          <span>EXPLORE</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-white border-gray-200 mt-2 w-80 p-0" 
        align="center"
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Discover Experiences</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <DropdownMenuItem key={category.name} asChild className="p-0">
                <Link 
                  to={category.path}
                  className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer w-full"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-50 rounded-lg mr-3 flex-shrink-0">
                    <category.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{category.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-4 pt-3">
            <Link 
              to="/events"
              className="block text-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View All Experiences →
            </Link>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExploreDropdown;
