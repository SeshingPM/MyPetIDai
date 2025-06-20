import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Document } from '@/utils/types';
import { fetchAllDocuments } from '@/utils/document-api/fetch';
import { useDocumentRefresh } from '@/utils/document-api/refresh';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { usePets } from '@/contexts/pets';

interface UseDocumentsDataProps {
  refreshTrigger?: number;
  contentId: string;
  staleTime?: number;
}

export const useDocumentsData = ({
  refreshTrigger = 0,
  contentId,
  staleTime = 1000 * 60 * 2 // 2 minutes by default
}: UseDocumentsDataProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { refreshDocuments: refreshDocsUtil } = useDocumentRefresh();
  const [cachedDocuments, setCachedDocuments] = useState<Document[]>([]);
  const isRefreshingRef = useRef(false);
  const { pets } = usePets();
  
  // Use React Query for efficient document data fetching with caching
  const {
    data: fetchedDocuments,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['documents', 'all', refreshKey, refreshTrigger],
    queryFn: () => fetchAllDocuments(false),
    staleTime: staleTime,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    placeholderData: cachedDocuments,
    gcTime: 1000 * 60 * 10, // Keep cache for 10 minutes
  });
  
  // Enhance documents with pet information
  const documents = useMemo(() => {
    if (!fetchedDocuments || !pets) return fetchedDocuments;
    
    return fetchedDocuments.map(doc => {
      if (doc.petId) {
        const pet = pets.find(p => p.id === doc.petId);
        return {
          ...doc,
          petName: pet?.name
        };
      }
      return doc;
    });
  }, [fetchedDocuments, pets]);
  
  // Update cached documents when new data comes in
  useEffect(() => {
    if (documents && documents.length > 0) {
      setCachedDocuments(documents);
    }
  }, [documents]);
  
  // Log document changes for debugging
  useEffect(() => {
    if (documents && fetchedDocuments) {
      logger.info(`[DocumentsData ${contentId}] Have ${documents.length} documents (${fetchedDocuments.length} fetched)`);
      if (documents.length > 0) {
        logger.info(`[DocumentsData ${contentId}] First document:`, documents[0]);
      }
    }
  }, [documents, fetchedDocuments, contentId]);
  
  // Optimized refresh function with debounce logic
  const refreshDocuments = useCallback(async ({ showToast = false } = {}) => {
    if (isRefreshingRef.current) {
      logger.info(`[DocumentsContent ${contentId}] Refresh already in progress, skipping...`);
      return { success: false, skipped: true };
    }
    
    logger.info(`[DocumentsContent ${contentId}] Refreshing documents...`);
    isRefreshingRef.current = true;
    
    try {
      // Set a fresh key to force component refresh
      setRefreshKey(Date.now());
      
      const result = await refreshDocsUtil({
        showToast,
        forceRefetch: true
      });
      
      setTimeout(() => {
        isRefreshingRef.current = false;
      }, 300);
      
      return result;
    } catch (error) {
      logger.error(`[DocumentsContent ${contentId}] Error refreshing:`, error);
      isRefreshingRef.current = false;
      
      if (showToast) {
        toast.error('Failed to refresh documents. Please try again.');
      }
      return { success: false, error };
    }
  }, [refreshDocsUtil, contentId, setRefreshKey]);
  
  // Effect to force refresh on trigger change with debounce
  useEffect(() => {
    if (refreshTrigger > 0) {
      logger.info(`[DocumentsContent ${contentId}] Refresh triggered externally`);
      
      const timer = setTimeout(() => {
        refreshDocuments({ showToast: false });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [refreshTrigger, contentId, refreshDocuments]);
  
  // Track if this is the initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // After first successful data fetch, mark initial load as complete
  // We need to set isInitialLoad to false even when there are no documents
  useEffect(() => {
    if (isInitialLoad && !isLoading) {
      // Important: Mark initial load as complete regardless of whether we have documents
      // This ensures we don't get stuck in loading state when there are no documents
      setIsInitialLoad(false);
    }
  }, [isLoading, isInitialLoad]);
  
  // Return an empty array instead of undefined when we have no documents
  // This ensures the empty state is shown after loading instead of indefinite loading
  const documentsToReturn = useMemo(() => {
    // If loading has completed (isLoading is false), always return documents or empty array
    if (!isLoading) {
      return documents || cachedDocuments || [];
    }
    
    // During active loading, use cached documents if available
    return documents || cachedDocuments || [];
  }, [documents, cachedDocuments, isLoading]);
  
  // Only show loading state when explicitly loading
  // This prevents indefinite loading when there are no documents
  const isLoadingState = isLoading; // Don't extend loading state anymore
  
  return {
    documents: documentsToReturn,
    isLoading: isLoadingState,
    error,
    refetch,
    refreshKey,
    setRefreshKey,
    refreshDocuments
  };
};
