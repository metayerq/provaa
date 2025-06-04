import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AirbnbStyleSearchProps {
  className?: string;
}

const AirbnbStyleSearch: React.FC<AirbnbStyleSearchProps> = ({ className }) => {
  const [activeSection, setActiveSection] = useState<'date' | 'guests' | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  const searchRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Calculate dropdown position relative to the search bar
  const calculateDropdownPosition = (section: 'date' | 'guests') => {
    const searchElement = searchRef.current;
    const sectionElement = section === 'date' ? dateRef.current : guestsRef.current;
    
    if (!searchElement || !sectionElement) return;

    const searchRect = searchElement.getBoundingClientRect();
    const sectionRect = sectionElement.getBoundingClientRect();
    
    setDropdownPosition({
      top: searchRect.bottom + window.scrollY + 16, // 16px gap below search bar
      left: sectionRect.left + window.scrollX, // Always align with the specific section
      width: sectionRect.width
    });
  };

  // Update position when opening dropdowns or on scroll/resize
  useEffect(() => {
    if (activeSection) {
      calculateDropdownPosition(activeSection);
      
      const handleUpdate = () => calculateDropdownPosition(activeSection);
      window.addEventListener('scroll', handleUpdate);
      window.addEventListener('resize', handleUpdate);
      
      return () => {
        window.removeEventListener('scroll', handleUpdate);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [activeSection]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        // Check if click is on portal dropdown
        const dropdownElement = document.getElementById('search-dropdown-portal');
        if (!dropdownElement || !dropdownElement.contains(event.target as Node)) {
          setActiveSection(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveSection(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const formatDateRange = () => {
    if (!startDate) {
      return 'Add dates';
    }
    
    // Single date selected
    if (startDate && !endDate) {
      return startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    // Date range selected
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    
    return 'Add dates';
  };

  const formatGuestCount = () => {
    if (adultCount === 0) {
      return 'Add guests';
    }
    return `${adultCount} guest${adultCount !== 1 ? 's' : ''}`;
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // First click or reset - set single date
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      // Second click - determine if range or reset
      if (date.getTime() === startDate.getTime()) {
        // Clicking same date - keep as single date
        return;
      } else if (date >= startDate) {
        // Valid range - set end date
        setEndDate(date);
      } else {
        // Earlier date - reset to new single date
        setStartDate(date);
        setEndDate(null);
      }
    }
  };

  const handleQuickDateSelect = (type: 'today' | 'tomorrow' | 'weekend') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (type === 'today') {
      // Single date
      setStartDate(today);
      setEndDate(null);
    } else if (type === 'tomorrow') {
      // Single date
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setStartDate(tomorrow);
      setEndDate(null);
    } else if (type === 'weekend') {
      // Date range
      const daysUntilSaturday = (6 - today.getDay()) % 7;
      const saturday = new Date(today);
      
      if (daysUntilSaturday === 0 && today.getDay() === 6) {
        // Today is Saturday
        saturday.setDate(today.getDate());
      } else {
        saturday.setDate(today.getDate() + daysUntilSaturday);
      }
      
      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1);
      setStartDate(saturday);
      setEndDate(sunday);
    }
  };

  const handleSectionClick = (section: 'date' | 'guests') => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
      // Calculate position after state update
      setTimeout(() => calculateDropdownPosition(section), 0);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (startDate) {
      // Fix: Use local date string instead of ISO string to avoid timezone issues
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, '0');
      const day = String(startDate.getDate()).padStart(2, '0');
      params.append('startDate', `${year}-${month}-${day}`);
    }
    if (endDate) {
      // Fix: Use local date string instead of ISO string to avoid timezone issues
      const year = endDate.getFullYear();
      const month = String(endDate.getMonth() + 1).padStart(2, '0');
      const day = String(endDate.getDate()).padStart(2, '0');
      params.append('endDate', `${year}-${month}-${day}`);
    }
    if (adultCount > 0) {
      params.append('adults', adultCount.toString());
    }
    // Remove children and infants parameters since we're removing them from the UI
    
    // Navigate to events page with filters, or just /events if no filters
    const queryString = params.toString();
    navigate(queryString ? `/events?${queryString}` : '/events');
    
    // Close dropdowns
    setActiveSection(null);
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const calendarStartDate = new Date(firstDay);
    calendarStartDate.setDate(calendarStartDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 42; i++) {
      const date = new Date(calendarStartDate);
      date.setDate(calendarStartDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.getTime() === today.getTime();
      const isStartDate = startDate && date.getTime() === startDate.getTime();
      const isEndDate = endDate && date.getTime() === endDate.getTime();
      const isInRange = startDate && endDate && date >= startDate && date <= endDate;
      const isPast = date < today;

      days.push(
        <button
          key={i}
          onClick={() => !isPast && handleDateClick(date)}
          disabled={isPast}
          className={cn(
            "h-8 w-8 text-xs rounded-full transition-all duration-200 hover:bg-gray-100",
            !isCurrentMonth && "text-gray-300",
            isPast && "text-gray-300 cursor-not-allowed",
            isToday && "border border-emerald-600",
            (isStartDate || isEndDate) && "bg-emerald-600 text-white hover:bg-emerald-700",
            isInRange && !isStartDate && !isEndDate && "bg-emerald-100 text-emerald-800",
            !isPast && isCurrentMonth && "hover:bg-gray-100"
          )}
        >
          {date.getDate()}
        </button>
      );
    }

    return (
      <div className="w-full">
        {/* Month Navigation Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="text-lg font-medium">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const updateGuestCount = (type: 'adults', operation: 'add' | 'subtract') => {
    if (type === 'adults') {
      setAdultCount(prev => operation === 'add' ? prev + 1 : Math.max(0, prev - 1));
    }
  };

  // Render dropdown content in a portal
  const renderDropdownPortal = () => {
    if (!activeSection) return null;

    return createPortal(
      <div 
        id="search-dropdown-portal"
        className="fixed z-[9999]"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          minWidth: `${dropdownPosition.width}px`
        }}
      >
        {activeSection === 'date' && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden w-[480px] max-w-[90vw]">
            <div className="flex">
              {/* Quick Presets */}
              <div className="w-32 bg-gray-50 p-4 border-r">
                <div className="space-y-2">
                  <button
                    onClick={() => handleQuickDateSelect('today')}
                    className="w-full text-left text-sm py-2 px-2 rounded hover:bg-gray-100 transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => handleQuickDateSelect('tomorrow')}
                    className="w-full text-left text-sm py-2 px-2 rounded hover:bg-gray-100 transition-colors"
                  >
                    Tomorrow
                  </button>
                  <button
                    onClick={() => handleQuickDateSelect('weekend')}
                    className="w-full text-left text-sm py-2 px-2 rounded hover:bg-gray-100 transition-colors"
                  >
                    Weekend
                  </button>
                </div>
              </div>
              
              {/* Calendar */}
              <div className="flex-1 p-4">
                {renderCalendar()}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'guests' && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-[300px] max-w-[90vw]">
            {/* Only Adults - removed Children and Infants */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-gray-900">Adults</div>
                  <div className="text-sm text-gray-500">Ages 13 or above</div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateGuestCount('adults', 'subtract')}
                    disabled={adultCount <= 0}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-gray-600">−</span>
                  </button>
                  <span className="w-6 text-center font-medium">{adultCount}</span>
                  <button
                    onClick={() => updateGuestCount('adults', 'add')}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                  >
                    <span className="text-gray-600">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>,
      document.body
    );
  };

  return (
    <>
      <div ref={searchRef} className={cn("search-container max-w-2xl mx-auto relative", className)}>
        <div className="search-bar bg-white rounded-full p-1 shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-gray-200 flex items-center relative">
          {/* Date Section */}
          <div 
            ref={dateRef}
            className="search-section flex-1 px-4 py-2.5 cursor-pointer hover:bg-gray-50 rounded-full transition-colors relative"
            onClick={() => handleSectionClick('date')}
          >
            <div className="section-label text-xs font-medium text-gray-700 uppercase tracking-wide">DATE</div>
            <div className="section-value text-sm text-gray-900 mt-0.5 truncate">{formatDateRange()}</div>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200"></div>

          {/* Guests Section */}
          <div 
            ref={guestsRef}
            className="search-section flex-1 px-4 py-2.5 cursor-pointer hover:bg-gray-50 rounded-full transition-colors relative"
            onClick={() => handleSectionClick('guests')}
          >
            <div className="section-label text-xs font-medium text-gray-700 uppercase tracking-wide">WHO</div>
            <div className="section-value text-sm text-gray-900 mt-0.5 truncate">{formatGuestCount()}</div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="search-button h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white p-0 ml-1 transition-all duration-200 hover:scale-105 shadow-md"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Render dropdown in portal */}
      {renderDropdownPortal()}
    </>
  );
};

export default AirbnbStyleSearch; 