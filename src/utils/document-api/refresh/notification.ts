/**
 * Utility functions for cross-tab notification
 */
import logger from '@/utils/logger';

/**
 * Notify other tabs about document changes
 */
export const notifyDocumentChange = (): void => {
  try {
    localStorage.setItem('document_updated', Date.now().toString());
    logger.debug('[Document Refresh] Notified other tabs about document change');
  } catch (error) {
    logger.error('[Document Refresh] Error notifying other tabs:', error);
    // Ignore localStorage errors
  }
};

/**
 * Set up a listener for document changes from other tabs
 */
export const setupDocumentChangeListener = (callback: () => void): () => void => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'document_updated') {
      logger.info('[Document Refresh] Document update detected from another tab');
      callback();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Return cleanup function
  return () => window.removeEventListener('storage', handleStorageChange);
};
