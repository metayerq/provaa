
import React, { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LocationSelector = () => {
  const [selectedCity, setSelectedCity] = useState("Lisbon");

  const cities = [
    { name: "Lisbon", available: true },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-white font-medium text-sm flex items-center space-x-1 hover:text-gray-300 hover:bg-gray-800"
        >
          <MapPin className="h-4 w-4" />
          <span>{selectedCity}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-white border-gray-200 mt-2 w-48" 
        align="start"
      >
        <div className="p-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Select City</h3>
          {cities.map((city) => (
            <DropdownMenuItem 
              key={city.name} 
              onClick={() => setSelectedCity(city.name)}
              className="cursor-pointer p-2 rounded hover:bg-gray-50"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-gray-900">{city.name}</span>
                {selectedCity === city.name && (
                  <span className="text-emerald-600 text-xs">✓</span>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          <div className="border-t border-gray-200 mt-2 pt-2">
            <p className="text-xs text-gray-500 text-center">
              More cities coming soon
            </p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocationSelector;
