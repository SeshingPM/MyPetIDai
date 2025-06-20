import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllDocuments } from '@/utils/document-api/fetch';
import FadeIn from '@/components/animations/FadeIn';
import DashboardRecentDocumentsSection from '../DashboardRecentDocumentsSection';

// Simplified implementation that uses the self-contained DashboardRecentDocumentsSection
const RealDocumentsTab: React.FC = () => {
  // Directly use React Query here to ensure we're getting fresh data
  const {
    data: documents = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['dashboardRealDocuments'],
    queryFn: async () => {
      try {
        // Fetch all documents and take only the most recent ones
        const allDocs = await fetchAllDocuments(false);
        
        // Sort by createdAt in descending order (newest first)
        const sortedDocs = [...allDocs].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        const limitedDocs = sortedDocs.slice(0, 3);
        return limitedDocs;
      } catch (err) {
        console.error('Error fetching documents:', err);
        throw err;
      }
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true,
    placeholderData: [],
  });

  return (
    <FadeIn>
      <DashboardRecentDocumentsSection
        documents={documents}
        isLoading={isLoading}
        error={error as Error | null}
        onRefresh={refetch}
      />
    </FadeIn>
  );
};

export default RealDocumentsTab;