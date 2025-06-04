/**
 * Utility functions for price formatting across the application
 */

/**
 * Format price to show "FREE" when price is 0 or "€X" when price > 0
 * @param price - The price value to format
 * @param options - Optional formatting options
 * @returns Formatted price string
 */
export const formatPrice = (price: number, options: { 
  showPerPerson?: boolean; 
  currency?: string;
} = {}): string => {
  const { showPerPerson = false, currency = '€' } = options;
  
  if (price === 0 || price === null || price === undefined) {
    return 'FREE';
  }
  
  const formattedPrice = `${currency}${price}`;
  return showPerPerson ? `${formattedPrice} per person` : formattedPrice;
};

/**
 * Format price for display with conditional per person text
 * Only shows "per person" for paid events (price > 0)
 * @param price - The price value to format
 * @returns "FREE" for free events or "€X per person" for paid events
 */
export const formatPriceWithPerPerson = (price: number): string => {
  if (price === 0 || price === null || price === undefined) {
    return 'FREE';
  }
  return formatPrice(price, { showPerPerson: true });
};

/**
 * Get just the price part without "per person" text
 * @param price - The price value to format
 * @returns Just the price part: "FREE" or "€X"
 */
export const formatPriceOnly = (price: number): string => {
  return formatPrice(price, { showPerPerson: false });
}; 