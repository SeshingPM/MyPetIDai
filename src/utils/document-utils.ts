
import { DOCUMENT_CATEGORIES } from './types';
import { Document } from './types';

// Re-export the Document type
export type { Document };

/**
 * Combines default document categories with custom categories
 * @param customCategories Array of user-defined custom categories
 * @param includeAllCategories Whether to include the 'All Categories' option
 * @returns Combined array of unique categories
 */
export const getCombinedCategories = (
  customCategories: string[] = [], 
  includeAllCategories: boolean = true
): string[] => {
  // Start with default categories
  const defaultCategories = includeAllCategories 
    ? DOCUMENT_CATEGORIES 
    : DOCUMENT_CATEGORIES.slice(1); // Skip "All Categories"
  
  // Combine with custom categories and remove duplicates
  const combinedCategories = [...defaultCategories];
  
  // Add custom categories that don't already exist in the default list
  customCategories.forEach(category => {
    if (!combinedCategories.includes(category)) {
      combinedCategories.push(category);
    }
  });
  
  return combinedCategories;
};

/**
 * Determines if a category is a custom category (not in the default list)
 * @param category The category to check
 * @returns True if it's a custom category, false otherwise
 */
export const isCustomCategory = (category: string): boolean => {
  return !DOCUMENT_CATEGORIES.includes(category);
};
