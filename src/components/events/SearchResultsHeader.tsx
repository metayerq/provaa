import React from 'react';
import { X, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SearchResultsHeaderProps {
  filteredCount: number;
  totalCount: number;
  searchStartDate?: Date | null;
  searchEndDate?: Date | null;
  searchGuestCount?: number;
  searchTerm?: string;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  filteredCount,
  totalCount,
  searchStartDate,
  searchEndDate,
  searchGuestCount,
  searchTerm
}) => {
  const navigate = useNavigate();
  const hasActiveFilters = searchStartDate || searchEndDate || (searchGuestCount && searchGuestCount > 0) || searchTerm;

  const formatDateRange = () => {
    if (!searchStartDate) return null;
    
    if (searchStartDate && !searchEndDate) {
      return searchStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    if (searchStartDate && searchEndDate) {
      return `${searchStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${searchEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    
    return null;
  };

  const clearAllFilters = () => {
    navigate('/events');
  };

  const clearDateFilter = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('startDate');
    params.delete('endDate');
    navigate(`/events?${params.toString()}`);
  };

  const clearGuestFilter = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('adults');
    params.delete('children');
    params.delete('infants');
    navigate(`/events?${params.toString()}`);
  };

  const clearSearchFilter = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('search');
    navigate(`/events?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredCount === totalCount ? (
              `${filteredCount} experiences`
            ) : (
              `${filteredCount} of ${totalCount} experiences`
            )}
          </h2>
          {hasActiveFilters && (
            <p className="text-sm text-gray-600 mt-1">
              Showing results matching your search criteria
            </p>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            Clear all filters
          </Button>
        )}
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {/* Date filter */}
          {(searchStartDate || searchEndDate) && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm">
              <Calendar className="h-4 w-4" />
              <span>{formatDateRange()}</span>
              <button
                onClick={clearDateFilter}
                className="hover:bg-emerald-100 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Guest count filter */}
          {searchGuestCount && searchGuestCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
              <Users className="h-4 w-4" />
              <span>{searchGuestCount} guest{searchGuestCount !== 1 ? 's' : ''}</span>
              <button
                onClick={clearGuestFilter}
                className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Search term filter */}
          {searchTerm && (
            <div className="flex items-center gap-2 bg-purple-50 text-purple-800 px-3 py-1 rounded-full text-sm">
              <span>"{searchTerm}"</span>
              <button
                onClick={clearSearchFilter}
                className="hover:bg-purple-100 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* No results message */}
      {filteredCount === 0 && hasActiveFilters && (
        <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No experiences found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or browse all available experiences.
          </p>
          <Button
            onClick={clearAllFilters}
            variant="outline"
            className="bg-white"
          >
            View all experiences
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResultsHeader; 