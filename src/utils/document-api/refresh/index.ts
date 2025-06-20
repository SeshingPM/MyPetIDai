import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notifyDocumentChange } from './notification';
import { RefreshOptions, RefreshResult } from './types';
import { fetchAllDocuments, fetchPetDocuments } from '../fetch';

/**
 * Simplified hook for document refresh operations
 */
export const useDocumentRefresh = () => {
  const queryClient = useQueryClient();
  
  /**
   * Refresh document data with simplified cache invalidation
   */
  const refreshDocuments = async (options: RefreshOptions = {}): Promise<RefreshResult> => {
    const { petId, showToast = false, forceRefetch = false } = options;
    const refreshId = Math.random().toString(36).substring(2, 8);
    
    try {
      console.log(`[DocRefresh ${refreshId}] Starting document refresh, petId: ${petId || 'none'}, forceRefetch: ${forceRefetch}`);
      
      // SIMPLIFIED: Single cache invalidation with specific query key
      if (petId) {
        await queryClient.invalidateQueries({
          queryKey: ['petDocuments', petId],
          exact: true
        });
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['documents'],
          exact: false
        });
      }
      
      // Force immediate refetch if requested
      if (forceRefetch) {
        try {
          if (petId) {
            await queryClient.fetchQuery({
              queryKey: ['petDocuments', petId],
              queryFn: () => fetchPetDocuments(petId)
            });
          } else {
            await queryClient.fetchQuery({
              queryKey: ['documents', 'all'],
              queryFn: () => fetchAllDocuments(false)
            });
          }
        } catch (fetchError) {
          console.error(`[DocRefresh ${refreshId}] Fetch error:`, fetchError);
        }
      }
      
      // Disable notification system to prevent cascading refreshes
      // notifyDocumentChange();
      
      if (showToast) {
        toast.success('Documents refreshed');
      }
      
      console.log(`[DocRefresh ${refreshId}] Document refresh completed successfully`);
      return { success: true };
    } catch (error) {
      console.error(`[DocRefresh ${refreshId}] Error refreshing documents:`, error);
      if (showToast) {
        toast.error('Failed to refresh documents');
      }
      return {
        success: false,
        error
      };
    }
  };
  
  return {
    refreshDocuments
  };
};
