
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Document } from '@/utils/types';
import { toggleDocumentFavorite } from '@/utils/document-api';
import { useDocumentRefresh } from '@/utils/document-api/refresh';
import { toast } from 'sonner';

/**
 * Hook for handling document changes (favorites, etc)
 */
export const useDocumentChanges = (
  petId: string, 
  setRefreshKey: (key: number) => void
) => {
  const queryClient = useQueryClient();
  const { refreshDocuments } = useDocumentRefresh();

  // Document change handler with simplified refresh to avoid redundant calls
  const handleDocumentChange = useCallback(async () => {
    console.log(`[PetDocumentsTab] Document changed for pet ${petId}, refreshing...`);
    
    try {
      // Use a single refresh method instead of multiple invalidations
      // This will handle both the API refresh and cache invalidation
      await refreshDocuments({
        petId,
        forceRefetch: true // Force immediate refetch
      });
      
      // Update the refresh key to trigger a component refetch
      setRefreshKey(Date.now());
      
      // Disable notification to prevent cascading refreshes
      // try {
      //   localStorage.setItem('document_updated', Date.now().toString());
      // } catch (e) {
      //   // Ignore localStorage errors
      // }
      
      console.log(`[PetDocumentsTab] Document refresh completed for pet ${petId}`);
      return true;
    } catch (err) {
      console.error(`[PetDocumentsTab] Error refreshing documents for pet ${petId}:`, err);
      return false;
    }
  }, [petId, refreshDocuments, setRefreshKey]);

  const handleToggleFavorite = async (document: Document) => {
    try {
      const success = await toggleDocumentFavorite(document.id, !document.isFavorite);
      if (success) {
        await handleDocumentChange();
      }
    } catch (error) {
      console.error(`[PetDocumentsTab] Error toggling favorite for document ${document.id}:`, error);
      toast.error('Failed to update favorite status');
    }
  };

  return {
    handleDocumentChange,
    handleToggleFavorite
  };
};
