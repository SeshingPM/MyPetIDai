import { useQuery } from '@tanstack/react-query';
import { Document } from '@/utils/types';
import { fetchAllDocuments } from '@/utils/document-api/fetch';

export const useDashboardDocuments = (limit: number = 3) => {
  console.log('[DashboardDocuments] Hook initialized');
  
  const {
    data: documents = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['dashboardDocuments'],
    queryFn: async () => {
      console.log('[DashboardDocuments] Fetching documents...');
      try {
        // Fetch all documents and take only the most recent ones
        const allDocs = await fetchAllDocuments(false);
        console.log(`[DashboardDocuments] Fetched ${allDocs.length} documents:`, allDocs);
        
        // Sort by createdAt in descending order (newest first)
        const sortedDocs = [...allDocs].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        const limitedDocs = sortedDocs.slice(0, limit);
        console.log(`[DashboardDocuments] Returning ${limitedDocs.length} documents`);
        return limitedDocs;
      } catch (err) {
        console.error('[DashboardDocuments] Error fetching documents:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - prevent frequent refetching
    refetchOnWindowFocus: false,
    placeholderData: [],
  });
  
  console.log(`[DashboardDocuments] Rendering with ${documents.length} documents:`, documents);

  return {
    documents,
    isLoading,
    error,
    refetch
  };
};