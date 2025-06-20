
import { useState, useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDocumentRefresh } from '@/utils/document-api/refresh';
import logger from '@/utils/logger';

/**
 * Hook that handles synchronization and refreshing of pet documents
 * with optimized performance
 */
export const usePetDocumentsSync = (petId: string, refreshTrigger = 0) => {
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const queryClient = useQueryClient();
  const { refreshDocuments } = useDocumentRefresh();
  const isRefreshingRef = useRef(false);
  
  // Update refreshKey when refreshTrigger changes with debouncing
  useEffect(() => {
    if (refreshTrigger > 0 && !isRefreshingRef.current) {
      const timer = setTimeout(() => {
        setRefreshKey(Date.now());
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [refreshTrigger]);
  
  // Optimized initialization - only refresh on mount, not repeatedly
  useEffect(() => {
    const loadPetDocuments = async () => {
      // First check if we already have this data in cache
      const cachedData = queryClient.getQueryData(['petDocuments', petId]);
      
      if (!cachedData && !isRefreshingRef.current) {
        isRefreshingRef.current = true;
        logger.info(`[PetDocumentsTab] Initial load for pet ${petId}`);
        
        try {
          await refreshDocuments({ petId });
        } catch (err) {
          logger.error(`[PetDocumentsTab] Error initializing pet ${petId} documents:`, err);
        } finally {
          setTimeout(() => {
            isRefreshingRef.current = false;
          }, 300);
        }
      }
    };
    
    loadPetDocuments();
    
    // Disable visibility change refresh to prevent unnecessary refreshes
    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === 'visible' && !isRefreshingRef.current) {
    //     // Only refresh if page was hidden for more than 5 minutes
    //     const lastRefreshTime = queryClient.getQueryState(['petDocuments', petId])?.dataUpdatedAt || 0;
    //     const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    //
    //     if (lastRefreshTime < fiveMinutesAgo) {
    //       logger.info(`[PetDocumentsTab] Refreshing after tab became visible`);
    //       setRefreshKey(Date.now());
    //       refreshDocuments({ petId });
    //     }
    //   }
    // };
    //
    // document.addEventListener('visibilitychange', handleVisibilityChange);
    //
    // return () => {
    //   document.removeEventListener('visibilitychange', handleVisibilityChange);
    // };
    
    // No cleanup needed
    return () => {};
  }, [petId, refreshDocuments, queryClient]);

  // Exposed refresh function for direct component use with debouncing and lock
  const refreshPetDocuments = useCallback(async () => {
    if (isRefreshingRef.current) {
      logger.info(`[PetDocumentsTab] Refresh already in progress for pet ${petId}`);
      return false;
    }
    
    logger.info(`[PetDocumentsTab] Manual refresh triggered for pet ${petId}`);
    isRefreshingRef.current = true;
    
    try {
      // Invalidate queries immediately
      queryClient.invalidateQueries({
        queryKey: ['petDocuments', petId],
        exact: true
      });
      
      setRefreshKey(Date.now());
      
      // Directly call refreshDocuments without nested timeouts
      await refreshDocuments({ petId });
      
      // Set a timeout before allowing another refresh
      setTimeout(() => {
        isRefreshingRef.current = false;
      }, 1000); // Longer timeout to prevent rapid successive refreshes
      
      return true;
    } catch (err) {
      logger.error(`[PetDocumentsTab] Error during manual refresh:`, err);
      isRefreshingRef.current = false;
      return false;
    }
  }, [petId, queryClient, refreshDocuments]);

  return {
    refreshKey,
    setRefreshKey,
    refreshPetDocuments
  };
};
