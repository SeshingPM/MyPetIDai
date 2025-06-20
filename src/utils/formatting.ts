/**
 * Utility functions for formatting data in the application
 */

/**
 * Format a date string or Date object into a user-friendly format
 * @param dateInput The date to format (string or Date object)
 * @returns Formatted date string
 */
export const formatDate = (dateInput: string | Date): string => {
  if (!dateInput) return '';
  
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  // Handle invalid dates
  if (isNaN(date.getTime())) return 'Invalid date';
  
  // Format: May 16, 2025
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
