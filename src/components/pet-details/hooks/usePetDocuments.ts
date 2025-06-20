import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback, useState } from 'react';
import { Document } from '@/utils/types';
import { fetchPetDocuments } from '@/utils/document-api';
import { usePetDocumentsSync } from './usePetDocumentsSync';
import { useDocumentChanges } from './useDocumentChanges';
import { toast } from 'sonner';
import logger from '@/utils/logger';

export const usePetDocuments = (petId: string, refreshTrigger = 0) => {
  const queryClient = useQueryClient();
  const {
    refreshKey,
    setRefreshKey,
    refreshPetDocuments
  } = usePetDocumentsSync(petId, refreshTrigger);
  
  const {
    handleDocumentChange,
    handleToggleFavorite
  } = useDocumentChanges(petId, setRefreshKey);

  // Use a specific and stable query key structure with increased staleTime to reduce refreshes
  const {
    data: documents = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['petDocuments', petId, refreshKey],
    queryFn: async () => {
      try {
        // Fetch documents directly without cache dependency
        const docs = await fetchPetDocuments(petId);
        logger.info(`[PetDocuments] Fetched ${docs.length} documents for pet ${petId}`);
        return docs;
      } catch (error) {
        logger.error(`[PetDocuments] Failed to fetch documents for pet ${petId}:`, error);
        throw error;
      }
    },
    refetchOnWindowFocus: false, // Disable refetch on window focus to prevent unnecessary refreshes
    staleTime: 60 * 1000 * 30, // 30 minutes - increased stale time to reduce frequency of updates
    gcTime: 60 * 1000 * 60, // 60 minutes - keep data in cache longer
    retry: 1, // Reduce retries to prevent cascading requests
    placeholderData: [], // Use empty array as placeholder to prevent undefined
  });
  
  // Cached documents for immediate display
  const [cachedDocuments, setCachedDocuments] = useState<Document[]>([]);
  
  // Update cached documents when new data comes in
  useEffect(() => {
    if (documents && documents.length > 0) {
      setCachedDocuments(documents);
    }
  }, [documents]);
  
  // Memoized refresher function with force refresh
  const optimizedRefetch = useCallback(async () => {
    try {
      logger.info(`[PetDocuments] Manual refresh triggered for pet ${petId}`);
      
      // Invalidate React Query cache
      await queryClient.invalidateQueries({
        queryKey: ['petDocuments', petId],
        exact: true
      });
      
      // First refresh the pet documents through our sync mechanism
      await refreshPetDocuments();
      
      // Then force an immediate refetch from React Query
      await refetch();
      
      return true;
    } catch (err) {
      logger.error('[PetDocuments] Refetch error:', err);
      return false;
    }
  }, [petId, refetch, refreshPetDocuments, queryClient]);
  
  // Better error handling with appropriate user feedback
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error(`[PetDocuments] Error fetching pet ${petId} documents:`, error);
      
      if (!navigator.onLine) {
        toast.error('You appear to be offline. Please check your internet connection.');
      } else if (errorMessage.includes('403') || errorMessage.includes('permission')) {
        toast.error('You don\'t have permission to access these documents.');
      } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        toast.error('The requested documents could not be found.');
      } else if (errorMessage.includes('timeout') || errorMessage.includes('time out')) {
        toast.error('Request timed out. Please try again.');
      } else {
        toast.error('Failed to load documents. Please try again later.');
      }
    }
  }, [error, petId]);

  // Return cached documents immediately if available
  const finalDocuments = documents.length > 0 ? documents : cachedDocuments;

  return {
    documents: finalDocuments,
    isLoading: isLoading && finalDocuments.length === 0, // Only show loading if no cached data
    error,
    handleDocumentChange,
    handleToggleFavorite,
    refreshPetDocuments: optimizedRefetch,
    refetch: optimizedRefetch
  };
};
