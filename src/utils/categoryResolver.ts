
import { supabase } from '@/integrations/supabase/client';
import { categories } from './mockData';

// Cache for resolved custom category names
const customCategoryCache = new Map<string, string>();

export const resolveCategoryName = async (categoryId: string): Promise<string> => {
  console.log('Resolving category name for:', categoryId);
  
  // Handle empty or null categories
  if (!categoryId || categoryId.trim() === '') {
    return '';
  }

  // If it's a predefined category, return its label
  const predefinedCategory = categories.find(c => c.id === categoryId);
  if (predefinedCategory) {
    console.log('Found predefined category:', predefinedCategory.label);
    return predefinedCategory.label;
  }

  // Handle custom categories - check if it starts with "custom-" or is a direct UUID
  let actualId = categoryId;
  if (categoryId.startsWith('custom-')) {
    actualId = categoryId.replace('custom-', '');
  }

  // Check cache first for both formats
  const cacheKey = categoryId;
  if (customCategoryCache.has(cacheKey)) {
    const cachedName = customCategoryCache.get(cacheKey)!;
    console.log('Found cached custom category:', cachedName);
    return cachedName;
  }

  // Try to fetch from custom_categories table
  try {
    console.log('Fetching custom category with ID:', actualId);
    
    const { data, error } = await supabase
      .from('custom_categories')
      .select('name')
      .eq('id', actualId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching custom category:', error);
      return categoryId; // Fallback to original ID
    }

    if (data && data.name) {
      console.log('Successfully fetched custom category:', data.name);
      // Cache the result for both possible formats
      customCategoryCache.set(categoryId, data.name);
      customCategoryCache.set(actualId, data.name);
      customCategoryCache.set(`custom-${actualId}`, data.name);
      return data.name;
    }
  } catch (error) {
    console.error('Error resolving custom category:', error);
  }

  // Final fallback - return empty string for unknown categories to hide them
  console.log('Unknown category, returning empty string for:', categoryId);
  return '';
};

export const getCategoryEmoji = (categoryId: string): string => {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.emoji : "🍽️";
};
