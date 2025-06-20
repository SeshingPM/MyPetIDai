// Error tracking utility for Android document upload issues
import logger from './logger';

interface ErrorDetails {
  component: string;
  action: string;
  error: any;
  metadata?: Record<string, any>;
}

// Error types for better categorization
export const ErrorTypes = {
  DOCUMENT_UPLOAD: 'document_upload',
  NAVIGATION: 'navigation',
  FORM_SUBMISSION: 'form_submission',
  API_ERROR: 'api_error',
  REFRESH_ERROR: 'refresh_error'
};

// Create a global history of errors for debugging
declare global {
  interface Window {
    __androidUploadErrors: Array<{
      timestamp: string;
      type: string;
      details: ErrorDetails;
      stack?: string;
    }>;
  }
}

// Initialize error history if not exists
if (typeof window !== 'undefined') {
  window.__androidUploadErrors = window.__androidUploadErrors || [];
}

/**
 * Track and log an error with detailed information
 */
export const trackError = (type: string, details: ErrorDetails): void => {
  // Log to console with all details
  logger.error(`[ErrorTracker] ${type} error in ${details.component} during ${details.action}:`, details.error);
  
  // Save full details to global error history
  if (typeof window !== 'undefined') {
    window.__androidUploadErrors.push({
      timestamp: new Date().toISOString(),
      type,
      details,
      stack: details.error?.stack || new Error().stack,
    });
  }
  
  // Add breadcrumb for analytics
  try {
    // Log to local storage for persistence
    const errors = JSON.parse(localStorage.getItem('android_debug_errors') || '[]');
    errors.push({
      timestamp: new Date().toISOString(),
      type,
      component: details.component,
      action: details.action,
      message: details.error?.message || String(details.error),
    });
    localStorage.setItem('android_debug_errors', JSON.stringify(errors.slice(-20))); // Keep last 20 errors
  } catch (e) {
    // Ignore local storage errors
  }
};

/**
 * Wrapper to safely execute a function with error tracking
 */
export const trackExecution = async <T>(
  type: string,
  component: string,
  action: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    trackError(type, { component, action, error, metadata });
    throw error; // Re-throw to maintain original error flow
  }
};

/**
 * Add global error tracking for uncaught errors
 */
export const setupGlobalErrorTracking = (): void => {
  if (typeof window !== 'undefined') {
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      trackError('unhandled_promise', {
        component: 'global',
        action: 'promise_rejection',
        error: event.reason
      });
    });

    // Track unhandled errors
    window.addEventListener('error', (event) => {
      trackError('unhandled_error', {
        component: 'global',
        action: 'error',
        error: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });
  }
};

/**
 * Get error history for debugging
 */
export const getErrorHistory = (): Array<any> => {
  if (typeof window !== 'undefined') {
    return window.__androidUploadErrors || [];
  }
  return [];
};

/**
 * Debug helper to print all Android upload errors
 */
export const printAllErrors = (): void => {
  logger.info('===== Android Upload Error History =====');
  const errors = getErrorHistory();
  errors.forEach((error, index) => {
    logger.info(`Error #${index + 1} [${error.timestamp}] - ${error.type}:`);
    logger.info(`Component: ${error.details.component}, Action: ${error.details.action}`);
    logger.info('Error:', error.details.error);
    if (error.details.metadata) {
      logger.info('Metadata:', error.details.metadata);
    }
    if (error.stack) {
      logger.info('Stack:', error.stack);
    }
    logger.info('-----------------------------------');
  });
  logger.info(`Total errors: ${errors.length}`);
};
