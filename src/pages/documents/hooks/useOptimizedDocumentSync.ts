import { useEffect, useCallback, useState, useRef } from 'react';
import { toast } from 'sonner';
import { RefreshResult } from '@/utils/document-api/refresh/types';

/**
 * Optimized hook for document synchronization with debounced updates and mobile optimization
 */
export const useOptimizedDocumentSync = ({
  contentId,
  setRefreshKey,
  refreshDocuments
}: {
  contentId: string;
  setRefreshKey: (key: number) => void;
  refreshDocuments: (options: { showToast: boolean, forceRefetch?: boolean }) => Promise<RefreshResult | void>;
}) => {
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const refreshTimeoutRef = useRef<number | null>(null);

  
  // Adjust debounce time based on device type
  const DEBOUNCE_TIME = isMobile ? 5000 : 3000; // 5 seconds on mobile, 3 seconds on desktop
  const MAX_RETRIES = 3;
  const retryCountRef = useRef(0);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  // Debounced refresh to prevent multiple refreshes
  const debouncedRefresh = useCallback(() => {
    // Check if this is Android - skip refresh on Android to prevent issues
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/i.test(userAgent);
    if (isAndroid) {
      console.log(`[DocSync ${contentId}] ANDROID DEVICE DETECTED - Skipping refresh completely`);
      return;
    }
    
    // Clear any existing timeout
    if (refreshTimeoutRef.current !== null) {
      window.clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    
    const currentTime = Date.now();
    
    // Only refresh if enough time has passed since last refresh
    if (currentTime - lastRefreshTime > DEBOUNCE_TIME) {
      console.log(`[DocSync ${contentId}] Triggering refresh at ${new Date(currentTime).toISOString()}`);
      setLastRefreshTime(currentTime);
      setRefreshKey(currentTime);
      
      refreshDocuments({ showToast: false })
        .catch(err => {
          console.error(`[DocSync ${contentId}] Error during refresh:`, err);
          
          // Increment retry count
          retryCountRef.current += 1;
          
          if (retryCountRef.current <= MAX_RETRIES) {
            // Retry with exponential backoff
            const backoffTime = Math.min(1000 * Math.pow(2, retryCountRef.current), 10000);
            console.log(`[DocSync ${contentId}] Retrying in ${backoffTime}ms (attempt ${retryCountRef.current}/${MAX_RETRIES})`);
            
            setTimeout(() => debouncedRefresh(), backoffTime);
          } else {
            retryCountRef.current = 0;
            toast.error('Failed to sync documents. Please try again.');
          }
        })
        .finally(() => {
          // Reset retry count on success
          retryCountRef.current = 0;
        });
    } else {
      console.log(`[DocSync ${contentId}] Delaying refresh - last refresh was ${(currentTime - lastRefreshTime) / 1000}s ago`);
      
      // Schedule a refresh when the debounce time has passed
      refreshTimeoutRef.current = window.setTimeout(() => {
        console.log(`[DocSync ${contentId}] Executing delayed refresh`);
        setLastRefreshTime(Date.now());
        setRefreshKey(Date.now());
        
        refreshDocuments({ showToast: false })
          .catch(err => {
            console.error(`[DocSync ${contentId}] Error during delayed refresh:`, err);
            toast.error('Failed to sync documents. Please try again.');
          });
      }, DEBOUNCE_TIME - (currentTime - lastRefreshTime));
    }
  }, [contentId, lastRefreshTime, setRefreshKey, refreshDocuments, DEBOUNCE_TIME]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current !== null) {
        window.clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);
  
  // Set up window focus and storage event listeners for cross-tab synchronization
  useEffect(() => {
    // Use a ref to track if we're in the background to reduce unnecessary refreshes
    const isDocumentHidden = () => document.visibilityState === 'hidden';
    let wasHidden = isDocumentHidden();
    
    // Handle visibility change
    const handleVisibilityChange = () => {
      const hidden = isDocumentHidden();
      
      // Only refresh when coming back from hidden state
      if (wasHidden && !hidden) {
        console.log(`[DocSync ${contentId}] Document became visible, triggering refresh`);
        debouncedRefresh();
      }
      
      wasHidden = hidden;
    };
    
    // Handle storage events from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'document_updated') {
        console.log(`[DocSync ${contentId}] Document update from another tab`);
        debouncedRefresh();
      }
    };
    
    // Handle window focus events (when user returns to the tab)
    const handleWindowFocus = () => {
      console.log(`[DocSync ${contentId}] Window focus detected`);
      debouncedRefresh();
    };
    
    // Use visibilitychange which is more reliable across devices
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleWindowFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [debouncedRefresh, contentId]);

  // Function to force refresh regardless of debounce time
  const forceRefresh = useCallback(() => {
    console.log(`[DocSync ${contentId}] Force refresh requested`);
    
    // Check if this is Android - skip refresh on Android to prevent issues
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/i.test(userAgent);
    if (isAndroid) {
      console.log(`[DocSync ${contentId}] ANDROID DEVICE DETECTED - Skipping force refresh completely`);
      // Return empty success response to prevent errors
      return Promise.resolve({ success: true });
    }
    
    // Clear any pending timeouts
    if (refreshTimeoutRef.current !== null) {
      window.clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    
    const currentTime = Date.now();
    setLastRefreshTime(currentTime);
    setRefreshKey(currentTime);
    
    return refreshDocuments({ showToast: false, forceRefetch: true })
      .catch(err => {
        console.error(`[DocSync ${contentId}] Error during force refresh:`, err);
        toast.error('Failed to refresh documents. Please try again.');
        return { success: false, error: err };
      });
  }, [contentId, setRefreshKey, refreshDocuments]);

  return {
    debouncedRefresh,
    forceRefresh,
    isMobile
  };
};
