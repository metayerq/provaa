
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface GoogleMapProps {
  address: string;
  city: string;
  venue: string;
  className?: string;
  onClick?: () => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const GoogleMap: React.FC<GoogleMapProps> = ({ 
  address, 
  city, 
  venue, 
  className = "h-80 w-full rounded-xl border border-gray-200",
  onClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const API_KEY = 'AIzaSyDowuvUOr2FJxdMl6cm6RHBmsIeqsgpyz4';

  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initializeMap();
      };
      
      script.onerror = () => {
        setError('Failed to load Google Maps');
      };
      
      document.head.appendChild(script);
    };

    const initializeMap = async () => {
      if (!mapRef.current || !window.google) return;

      try {
        const geocoder = new window.google.maps.Geocoder();
        
        // Build full address, handle missing venue gracefully
        const fullAddress = venue && venue !== 'Unknown Venue' 
          ? `${venue}, ${address}, ${city}`
          : `${address}, ${city}`;
        
        console.log('Geocoding address:', fullAddress);

        // Geocode the address
        geocoder.geocode({ address: fullAddress }, (results: any[], status: string) => {
          console.log('Geocoding status:', status, 'Results:', results);
          
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            
            // Create the map
            const map = new window.google.maps.Map(mapRef.current, {
              center: location,
              zoom: 16,
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }]
                }
              ],
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
            });

            // Add a marker
            const marker = new window.google.maps.Marker({
              position: location,
              map: map,
              title: venue !== 'Unknown Venue' ? venue : address,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#10B981',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3,
              }
            });

            // Add info window
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; max-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937;">${venue !== 'Unknown Venue' ? venue : 'Event Location'}</h3>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">${address}<br>${city}</p>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });

            setMapLoaded(true);
          } else {
            console.error('Geocoding failed:', status);
            setError('Location not found');
          }
        });
      } catch (err) {
        console.error('Google Maps error:', err);
        setError('Error loading map');
      }
    };

    loadGoogleMaps();
  }, [address, city, venue, API_KEY]);

  if (error) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-gray-100 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <div className="text-center text-gray-600">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Map unavailable</p>
          <p className="text-xs text-gray-500">{venue !== 'Unknown Venue' ? venue : address}, {city}</p>
        </div>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-gray-100 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    />
  );
};
