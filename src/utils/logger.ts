/**
 * Utility for conditional logging based on environment
 */

// More reliable production detection using multiple methods
const isProduction = 
  // Check NODE_ENV environment variable
  process.env.NODE_ENV === 'production' ||
  // URL-based detection for extra reliability (when in browser context)
  (typeof window !== 'undefined' && 
   (window.location.hostname === 'mypetid.vercel.app' || 
    window.location.hostname.includes('vercel.app')));

// Set this to true to force production behavior for sensitive logs
// Should be false for development to see logs, true for testing production behavior
export const FORCE_PROD_LOGS = process.env.NODE_ENV === 'production';

// Create a logger object with methods that conditionally log based on environment
const logger = {
  /**
   * Log info messages (disabled in production)
   */
  info: (...args: any[]): void => {
    if (!isProduction && !FORCE_PROD_LOGS) {
      console.log(...args);
    }
  },
  
  /**
   * Log warning messages (disabled in production)
   */
  warn: (...args: any[]): void => {
    if (!isProduction && !FORCE_PROD_LOGS) {
      console.warn(...args);
    }
  },
  
  /**
   * Log error messages (always enabled for critical errors)
   * 
   * Note: In production, we could further filter these to only show
   * truly critical errors, or send them to an error tracking service.
   */
  error: (...args: any[]): void => {
    // Always log errors, even in production
    console.error(...args);
  },
  
  /**
   * Log debug messages (disabled in production)
   */
  debug: (...args: any[]): void => {
    if (!isProduction && !FORCE_PROD_LOGS) {
      console.debug(...args);
    }
  },

  /**
   * Logs that should ONLY be shown in development/local environments
   * Will never show in staging, preview, or production
   */
  devOnly: (...args: any[]): void => {
    if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
      console.log('[DEV ONLY]', ...args);
    }
  },
};

export default logger;
