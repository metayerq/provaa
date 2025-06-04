/**
 * Utility functions for date operations
 */

/**
 * Check if two dates represent the same day (ignoring time)
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

/**
 * Check if a date falls within a date range (inclusive)
 */
export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};

/**
 * Format a single date for display
 */
export const formatSingleDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Format a date range for display
 */
export const formatDateRange = (startDate: Date, endDate?: Date): string => {
  if (!endDate) {
    return formatSingleDate(startDate);
  }
  
  return `${formatSingleDate(startDate)} - ${formatSingleDate(endDate)}`;
};

/**
 * Get the start of day (00:00:00) for a given date
 */
export const getStartOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}; 