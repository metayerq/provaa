import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Event } from '@/utils/mockData';

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Helper function to filter events by date
const filterByDate = (events: Event[], startDate: Date | null, endDate: Date | null): Event[] => {
  if (!startDate) return events;
  
  return events.filter(event => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    
    if (endDate) {
      // Date range filtering - event date should be within the selected range
      return eventDate >= startDate && eventDate <= endDate;
    } else {
      // Single date filtering - event date should match the selected date
      return isSameDay(eventDate, startDate);
    }
  });
};

// Helper function to filter events by guest count
const filterByGuests = (events: Event[], totalGuests: number): Event[] => {
  if (totalGuests === 0) return events;
  
  return events.filter(event => {
    const availableSpots = event.spotsLeft || event.capacity;
    return availableSpots >= totalGuests;
  });
};

export const useEventsFilters = (events: Event[]) => {
  const [searchParams] = useSearchParams();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [guestCount, setGuestCount] = useState(1);
  const [duration, setDuration] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [additionalFilters, setAdditionalFilters] = useState<any>({});
  const [showFilters, setShowFilters] = useState(false);

  // NEW: State for search component filters
  const [searchStartDate, setSearchStartDate] = useState<Date | null>(null);
  const [searchEndDate, setSearchEndDate] = useState<Date | null>(null);
  const [searchGuestCount, setSearchGuestCount] = useState<number>(0);

  // Handle URL parameters from search component
  useEffect(() => {
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const adultsParam = searchParams.get('adults');
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('category');

    // Handle search term
    if (searchParam) {
      setSearchTerm(searchParam);
    }

    // Handle category
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }

    // Handle date parameters - Fixed to avoid timezone issues
    if (startDateParam) {
      // Parse date in local timezone to avoid off-by-one errors
      const [year, month, day] = startDateParam.split('-').map(Number);
      const startDate = new Date(year, month - 1, day); // month is 0-indexed
      setSearchStartDate(startDate);
      
      if (endDateParam) {
        const [endYear, endMonth, endDay] = endDateParam.split('-').map(Number);
        const endDate = new Date(endYear, endMonth - 1, endDay);
        setSearchEndDate(endDate);
      } else {
        setSearchEndDate(null);
      }
    } else {
      setSearchStartDate(null);
      setSearchEndDate(null);
    }

    // Handle guest count parameters - Only adults now
    const adults = parseInt(adultsParam || '0');
    setSearchGuestCount(adults);
    
    // Also update the regular guest count filter
    if (adults > 0) {
      setGuestCount(adults);
    }
  }, [searchParams]);

  // Apply filters whenever events or filter criteria change
  useEffect(() => {
    let filtered = [...events];

    // Filter out past events - only show upcoming events
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today for proper comparison
    
    filtered = filtered.filter(event => {
      if (!event.date) return false; // Exclude events without dates for better UX
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today; // Only show today and future events
    });

    // NEW: Apply search component date filters (takes precedence over regular date filter)
    if (searchStartDate || searchEndDate) {
      filtered = filterByDate(filtered, searchStartDate, searchEndDate);
    } else if (selectedDate) {
      // Fallback to regular date filter if no search dates
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      });
    }

    // NEW: Apply search component guest count filter (takes precedence over regular guest count)
    if (searchGuestCount > 0) {
      filtered = filterByGuests(filtered, searchGuestCount);
    } else {
      // Fallback to regular guest count filter
      filtered = filtered.filter(event => event.capacity >= guestCount);
    }

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(event => {
        return selectedCategories.some(selectedCat => {
          if (event.category === selectedCat) return true;
          if (selectedCat.startsWith('custom-') && event.category === selectedCat) return true;
          
          const categoryLower = event.category?.toLowerCase() || '';
          const selectedLower = selectedCat.toLowerCase();
          
          return categoryLower.includes(selectedLower) || selectedLower.includes(categoryLower);
        });
      });
    }

    // Duration filter
    if (duration) {
      filtered = filtered.filter(event => {
        if (!event.duration) return false;
        
        const eventDuration = event.duration.toLowerCase();
        switch (duration) {
          case '30min':
            return eventDuration.includes('30') && eventDuration.includes('min');
          case '45min':
            return eventDuration.includes('45') && eventDuration.includes('min');
          case '1h':
            return eventDuration.includes('1') && (eventDuration.includes('hour') || eventDuration.includes('h'));
          case '1.5h':
            return eventDuration.includes('1.5') || (eventDuration.includes('90') && eventDuration.includes('min'));
          case '2h':
            return eventDuration.includes('2') && (eventDuration.includes('hour') || eventDuration.includes('h'));
          case '3h':
            return eventDuration.includes('3') && (eventDuration.includes('hour') || eventDuration.includes('h'));
          case '4h+':
            return /[4-9]|[1-9][0-9]/.test(eventDuration) && (eventDuration.includes('hour') || eventDuration.includes('h'));
          default:
            return true;
        }
      });
    }

    // Price filter
    filtered = filtered.filter(event => 
      event.price >= priceRange[0] && event.price <= priceRange[1]
    );

    // Additional filters
    if (additionalFilters.dietaryOptions?.length > 0) {
      filtered = filtered.filter(event => {
        if (!event.dietaryOptions) return false;
        return additionalFilters.dietaryOptions.some((option: string) => 
          event.dietaryOptions?.includes(option.toLowerCase())
        );
      });
    }

    setFilteredEvents(filtered);
  }, [
    events, 
    searchTerm, 
    selectedCategories, 
    selectedDate, 
    guestCount, 
    duration, 
    priceRange, 
    additionalFilters,
    searchStartDate, // NEW
    searchEndDate,   // NEW
    searchGuestCount // NEW
  ]);

  return {
    filteredEvents,
    searchTerm,
    setSearchTerm,
    selectedCategories,
    setSelectedCategories,
    selectedDate,
    setSelectedDate,
    guestCount,
    setGuestCount,
    duration,
    setDuration,
    priceRange,
    setPriceRange,
    additionalFilters,
    setAdditionalFilters,
    showFilters,
    setShowFilters,
    // NEW: Expose search component filter states
    searchStartDate,
    searchEndDate,
    searchGuestCount
  };
};
