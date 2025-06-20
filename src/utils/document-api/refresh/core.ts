
import { useQueryClient } from '@tanstack/react-query';
import { RefreshOptions, RefreshResult } from './types';

/**
 * Core functionality for invalidating document queries
 */
export const useDocumentQueryInvalidation = () => {
  const queryClient = useQueryClient();
  
  /**
   * Invalidate all document-related queries
   */
  const invalidateAllDocumentQueries = async (): Promise<void> => {
    console.log('[Document Refresh] Invalidating all document queries');
    
    await queryClient.invalidateQueries({ 
      queryKey: ['documents'],
      exact: false 
    });
  };
  
  /**
   * Invalidate a specific pet's document queries
   */
  const invalidatePetDocumentQueries = async (petId: string): Promise<void> => {
    if (!petId) {
      console.warn('[Document Refresh] No petId provided for invalidation');
      return;
    }
    
    console.log(`[Document Refresh] Invalidating documents for pet: ${petId}`);
    
    await queryClient.invalidateQueries({ 
      queryKey: ['petDocuments', petId],
      exact: true
    });
    
    // Also invalidate all documents collection to maintain global synchronization
    await queryClient.invalidateQueries({
      queryKey: ['documents', 'all'],
      exact: false
    });
  };
  
  /**
   * Force a refetch of all document queries
   */
  const refetchAllDocumentQueries = async (options: RefreshOptions = {}): Promise<void> => {
    if (!options.forceRefetch) return;
    
    console.log('[Document Refresh] Force-refetching all document queries');
    
    await queryClient.refetchQueries({
      queryKey: ['documents'],
      type: 'all',
      exact: false
    });
  };
  
  /**
   * Force a refetch of a specific pet's document queries
   */
  const refetchPetDocumentQueries = async (petId: string, options: RefreshOptions = {}): Promise<void> => {
    if (!options.forceRefetch || !petId) return;
    
    console.log(`[Document Refresh] Force-refetching documents for pet: ${petId}`);
    
    await queryClient.refetchQueries({
      queryKey: ['petDocuments', petId],
      type: 'all',
      exact: true
    });
    
    // Also refresh all documents for global consistency
    await queryClient.refetchQueries({
      queryKey: ['documents', 'all'],
      type: 'all',
      exact: false
    });
  };
  
  return {
    invalidateAllDocumentQueries,
    invalidatePetDocumentQueries,
    refetchAllDocumentQueries,
    refetchPetDocumentQueries,
  };
};
