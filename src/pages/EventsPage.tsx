import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import GroupedEventsView from '@/components/GroupedEventsView';
import GroupBreadcrumb from '@/components/GroupBreadcrumb';
import EventsPageHeader from '@/components/events/EventsPageHeader';
import CompactFilterBar from '@/components/events/CompactFilterBar';
import EventsStatsBar from '@/components/events/EventsStatsBar';
import EventsGrid from '@/components/events/EventsGrid';
import SearchResultsHeader from '@/components/events/SearchResultsHeader';
import { useEventsData } from '@/components/events/useEventsData';
import EventsPageSkeleton from '@/components/events/EventsPageSkeleton';
import {
  groupEventsByCity,
  groupEventsByHost,
  groupEventsByVenue,
  groupEventsByType,
  GroupedData
} from '@/utils/eventGrouping';

const EventsPage = () => {
  const [searchParams] = useSearchParams();
  const {
    events,
    filteredEvents,
    loading,
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
    searchStartDate,
    searchEndDate,
    searchGuestCount
  } = useEventsData();

  const [groupedData, setGroupedData] = useState<GroupedData>({});
  const [groupingLoading, setGroupingLoading] = useState(false);

  // Get groupBy parameter from URL and redirect cuisine to type
  const groupBy = searchParams.get('groupBy');
  
  // Redirect cuisine grouping to type grouping
  if (groupBy === 'cuisine') {
    return <Navigate to="/events?groupBy=type" replace />;
  }
  
  const isGroupedView = groupBy && ['city', 'host', 'venue', 'type'].includes(groupBy);

  // Check if we have search filters from the main search component
  const hasSearchFilters = searchStartDate || searchEndDate || (searchGuestCount && searchGuestCount > 0) || searchTerm;

  // Generate grouped data whenever filteredEvents or groupBy changes
  useEffect(() => {
    const generateGroupedData = async () => {
      if (isGroupedView && filteredEvents.length > 0) {
        setGroupingLoading(true);
        try {
          let grouped: GroupedData = {};
          
          switch (groupBy) {
            case 'city':
              grouped = groupEventsByCity(filteredEvents);
              break;
            case 'host':
              grouped = groupEventsByHost(filteredEvents);
              break;
            case 'venue':
              grouped = groupEventsByVenue(filteredEvents);
              break;
            case 'type':
              grouped = await groupEventsByType(filteredEvents);
              break;
          }
          
          setGroupedData(grouped);
        } catch (error) {
          console.error('Error generating grouped data:', error);
          setGroupedData({});
        } finally {
          setGroupingLoading(false);
        }
      } else {
        setGroupedData({});
      }
    };

    generateGroupedData();
  }, [isGroupedView, groupBy, filteredEvents]);

  if (loading) {
    return <EventsPageSkeleton />;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb for grouped views */}
        {isGroupedView && <GroupBreadcrumb groupBy={groupBy} />}

        {/* Regular header for non-grouped views - only show if no search filters */}
        {!isGroupedView && !hasSearchFilters && (
          <EventsPageHeader 
            title="Discover Experiences"
          />
        )}

        {/* Search Results Header - show when we have search filters */}
        {!isGroupedView && hasSearchFilters && (
          <SearchResultsHeader
            filteredCount={filteredEvents.length}
            totalCount={events.length}
            searchStartDate={searchStartDate}
            searchEndDate={searchEndDate}
            searchGuestCount={searchGuestCount}
            searchTerm={searchTerm}
          />
        )}

        {/* Compact Filter Bar - only show for regular view */}
        {!isGroupedView && (
          <CompactFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            guestCount={guestCount}
            setGuestCount={setGuestCount}
            duration={duration}
            setDuration={setDuration}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            additionalFilters={additionalFilters}
            setAdditionalFilters={setAdditionalFilters}
          />
        )}

        {/* Grouped View */}
        {isGroupedView ? (
          groupingLoading ? (
            <div className="flex justify-center items-center min-h-64">
              <div className="text-lg text-gray-600">Loading {groupBy} data...</div>
            </div>
          ) : (
            <GroupedEventsView
              groupBy={groupBy}
              groupedData={groupedData}
              events={filteredEvents}
            />
          )
        ) : (
          <>
            {/* Events Grid */}
            {/* Only show EventsStatsBar if we don't have search filters (SearchResultsHeader shows count instead) */}
            {!hasSearchFilters && <EventsStatsBar eventCount={filteredEvents.length} />}
            <EventsGrid events={filteredEvents} totalEvents={events.length} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default EventsPage;
