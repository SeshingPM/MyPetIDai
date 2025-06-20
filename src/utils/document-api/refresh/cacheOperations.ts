
import { QueryClient } from '@tanstack/react-query';

export const updateOptimisticCache = (
  queryClient: QueryClient,
  optimisticData: any,
  petId?: string,
  refreshId: string = 'unknown'
) => {
  if (!optimisticData) return;

  // Update the 'all documents' query
  queryClient.setQueryData(['documents', 'all'], (oldData: any) => {
    console.log(`[DocRefresh ${refreshId}] Applying optimistic update to all documents`);
    if (!oldData || !Array.isArray(oldData)) return [optimisticData, ...(oldData || [])];
    return [optimisticData, ...oldData];
  });
  
  // Update dashboard documents
  queryClient.setQueryData(['dashboardDocuments'], (oldData: any) => {
    console.log(`[DocRefresh ${refreshId}] Applying optimistic update to dashboard documents`);
    if (!oldData || !Array.isArray(oldData)) return [optimisticData, ...(oldData || [])];
    // Keep only the first 2 existing documents to maintain the limit of 3
    const limitedOldData = oldData.slice(0, 2);
    return [optimisticData, ...limitedOldData];
  });
  
  // Update real dashboard documents
  queryClient.setQueryData(['dashboardRealDocuments'], (oldData: any) => {
    console.log(`[DocRefresh ${refreshId}] Applying optimistic update to real dashboard documents`);
    if (!oldData || !Array.isArray(oldData)) return [optimisticData, ...(oldData || [])];
    // Keep only the first 2 existing documents to maintain the limit of 3
    const limitedOldData = oldData.slice(0, 2);
    return [optimisticData, ...limitedOldData];
  });
  
  // If we have a petId, also update pet-specific documents
  if (petId) {
    queryClient.setQueryData(['petDocuments', petId], (oldData: any) => {
      if (!oldData || !Array.isArray(oldData)) return [optimisticData, ...(oldData || [])];
      return [optimisticData, ...oldData];
    });
  }
};

export const invalidateQueries = async (
  queryClient: QueryClient,
  petId?: string,
  refreshId: string = 'unknown'
) => {
  // 1. First, force immediate invalidation of ALL document-related queries
  console.log(`[DocRefresh ${refreshId}] Invalidating all document-related queries`);
  await queryClient.invalidateQueries({
    queryKey: ['documents'],
    exact: false,
    refetchType: 'all' // Force refetch all queries
  });
  
  // 2. Specifically invalidate and force refetch the main documents list
  console.log(`[DocRefresh ${refreshId}] Specifically invalidating main documents list`);
  await queryClient.invalidateQueries({
    queryKey: ['documents', 'all'],
    exact: false,
    refetchType: 'all' // Force refetch
  });
  
  // 3. Also invalidate dashboard documents
  console.log(`[DocRefresh ${refreshId}] Invalidating dashboard documents`);
  await queryClient.invalidateQueries({
    queryKey: ['dashboardDocuments'],
    exact: true,
    refetchType: 'all' // Force refetch
  });
  
  // 3.5. Also invalidate real dashboard documents
  console.log(`[DocRefresh ${refreshId}] Invalidating real dashboard documents`);
  await queryClient.invalidateQueries({
    queryKey: ['dashboardRealDocuments'],
    exact: true,
    refetchType: 'all' // Force refetch
  });
  
  // 4. If we have a petId, invalidate and force refetch pet-specific documents
  if (petId) {
    console.log(`[DocRefresh ${refreshId}] Invalidating pet documents for: ${petId}`);
    await queryClient.invalidateQueries({
      queryKey: ['petDocuments', petId],
      exact: true,
      refetchType: 'all' // Force refetch
    });
  }
};

export const refetchQueries = async (
  queryClient: QueryClient,
  refreshId: string = 'unknown'
) => {
  console.log(`[DocRefresh ${refreshId}] Explicitly refetching all document queries`);
  await queryClient.refetchQueries({
    queryKey: ['documents'],
    type: 'all',
    exact: false
  });
  
  // Also explicitly refetch dashboard documents
  console.log(`[DocRefresh ${refreshId}] Explicitly refetching dashboard documents`);
  await queryClient.refetchQueries({
    queryKey: ['dashboardDocuments'],
    type: 'all',
    exact: true
  });
  
  // Also explicitly refetch real dashboard documents
  console.log(`[DocRefresh ${refreshId}] Explicitly refetching real dashboard documents`);
  await queryClient.refetchQueries({
    queryKey: ['dashboardRealDocuments'],
    type: 'all',
    exact: true
  });
};
