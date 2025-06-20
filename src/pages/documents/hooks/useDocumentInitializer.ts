
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshResult } from '@/utils/document-api/refresh/types';

interface UseDocumentInitializerProps {
  contentId: string;
  refetch: () => Promise<any>;
  refreshDocuments: (options: { showToast: boolean }) => Promise<RefreshResult | void>;
}

export const useDocumentInitializer = ({ 
  contentId, 
  refetch, 
  refreshDocuments 
}: UseDocumentInitializerProps) => {
  
  const queryClient = useQueryClient();
  
  // Initial setup and periodic refresh
  useEffect(() => {
    const initializeDocuments = async () => {
      console.log(`[DocumentsContent ${contentId}] Component mounted, initializing documents...`);
      
      // Force invalidation of all document caches
      queryClient.invalidateQueries({
        queryKey: ['documents'],
        exact: false
      });
      
      // Perform initial document loading
      try {
        // Force immediate refetch
        await refetch();
        console.log(`[DocumentsContent ${contentId}] Initial fetch completed`);
        
        // Force a comprehensive refresh of all document caches
        await refreshDocuments({ showToast: false });
        
        console.log(`[DocumentsContent ${contentId}] Initial document load completed`);
      } catch (error) {
        console.error(`[DocumentsContent ${contentId}] Error during initialization:`, error);
      }
    };
    
    // Execute immediate initialization
    initializeDocuments();
    
    // Poll for updates frequently
    const interval = setInterval(() => {
      console.log(`[DocumentsContent ${contentId}] Periodic document refresh triggered`);
      refreshDocuments({ showToast: false });
      // Also force a query refetch
      refetch();
    }, 5000);
    
    return () => {
      clearInterval(interval);
      console.log(`[DocumentsContent ${contentId}] Component unmounted`);
    };
  }, [refetch, refreshDocuments, contentId, queryClient]);
};
