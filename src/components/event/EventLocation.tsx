
import React, { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { GoogleMap } from '@/components/map/GoogleMap';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EventLocationProps {
  venue: string;
  address: string;
  city: string;
}

export const EventLocation: React.FC<EventLocationProps> = ({ 
  venue, 
  address, 
  city 
}) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const handleDirections = () => {
    const query = encodeURIComponent(`${venue}, ${address}, ${city}`);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    // Navigate in same window instead of popup
    window.location.href = url;
  };

  const handleViewMap = () => {
    setIsMapModalOpen(true);
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
        
        {/* Venue Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <MapPin className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{venue}</h3>
        </div>
        
        {/* Address */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <MapPin className="h-5 w-5 text-gray-600" />
          </div>
          <p className="text-gray-600">{address}, {city}</p>
        </div>
        
        {/* Map Preview */}
        <div className="mb-4">
          <GoogleMap
            venue={venue}
            address={address}
            city={city}
            className="h-80 w-full rounded-xl border border-gray-200 overflow-hidden cursor-pointer"
            onClick={handleViewMap}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleViewMap}
            variant="outline"
            className="border-emerald-200 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800"
          >
            <MapPin className="h-4 w-4 mr-2" />
            View Full Map
          </Button>
          <Button
            onClick={handleDirections}
            variant="outline"
            className="border-emerald-200 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
        </div>
      </div>

      {/* Map Modal */}
      <Dialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              {venue}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">{address}, {city}</p>
            <GoogleMap
              venue={venue}
              address={address}
              city={city}
              className="h-96 w-full rounded-lg border border-gray-200 overflow-hidden"
            />
            <Button
              onClick={handleDirections}
              className="w-full bg-emerald-700 hover:bg-emerald-800"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Get Directions in Google Maps
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
