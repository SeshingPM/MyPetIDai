
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchArchivedDocuments } from '@/utils/document-api';
import DocumentsList from '@/components/documents/DocumentsList';
import { Document } from '@/utils/types';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, History, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentsErrorState from '@/components/documents/DocumentsErrorState';
import { useQueryClient } from '@tanstack/react-query';

const ArchivedDocumentsTab = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isMounted = useRef(true);
  const queryClient = useQueryClient();
  
  // Cleanup function to prevent state updates after unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  const { 
    data: documents, 
    isLoading, 
    error, 
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['archivedDocuments', refreshTrigger],
    queryFn: async () => {
      // Call fetchArchivedDocuments without parameters since it no longer accepts any
      return await fetchArchivedDocuments();
    },
    staleTime: 1000, // 1 second - make it refresh more frequently
    gcTime: 30000, // 30 seconds
    retry: 2
  });

  // Force refresh when component mounts to ensure we have latest data
  useEffect(() => {
    const initialLoadTimeout = setTimeout(() => {
      handleManualRefresh();
    }, 100);
    
    return () => clearTimeout(initialLoadTimeout);
  }, []);

  // Safe set state that checks if component is mounted
  const safeSetIsRefreshing = useCallback((value: boolean) => {
    if (isMounted.current) {
      setIsRefreshing(value);
    }
  }, []);

  // Safely trigger a refresh after document actions
  const handleDocumentAction = useCallback(async () => {
    try {
      safeSetIsRefreshing(true);
      
      // Invalidate the query to force a fresh fetch
      queryClient.invalidateQueries({ queryKey: ['archivedDocuments'] });
      
      // Add a delay before refetching to ensure database operation completes
      await new Promise(resolve => setTimeout(resolve, 800));
      await refetch();
      
      console.log('Archived documents after refresh:', documents);
    } catch (error) {
      console.error('Error refreshing archived documents:', error);
      if (isMounted.current) {
        toast.error('Failed to refresh. Please reload the page.');
      }
    } finally {
      // Extra delay to ensure UI updates properly
      setTimeout(() => {
        safeSetIsRefreshing(false);
      }, 800);
    }
  }, [refetch, documents, queryClient, safeSetIsRefreshing]);

  // Force a refetch when a refresh is explicitly triggered
  const handleManualRefresh = useCallback(() => {
    console.log('Manual refresh triggered');
    safeSetIsRefreshing(true);
    
    // We trigger both a refetch and a refreshTrigger increment to ensure 
    // both the query and our component state are in sync
    refetch().finally(() => {
      // Small delay to reduce UI flickering
      setTimeout(() => {
        if (isMounted.current) {
          setRefreshTrigger(prev => prev + 1);
          safeSetIsRefreshing(false);
        }
      }, 500);
    });
    
  }, [refetch, safeSetIsRefreshing]);

  // Ensure we properly exit the refreshing state after fetching completes
  useEffect(() => {
    if (!isFetching && isRefreshing) {
      const timer = setTimeout(() => {
        safeSetIsRefreshing(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isFetching, isRefreshing, safeSetIsRefreshing]);

  if (isLoading || isRefreshing) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-gray-500">Loading archived documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <DocumentsErrorState onRetry={handleManualRefresh} />
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
        <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No archived documents</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Documents that you archive will appear here. You can restore them or delete them permanently.
        </p>
        <Button 
          variant="outline" 
          onClick={handleManualRefresh}
          className="mx-auto"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Alert className="mb-4 bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-700" />
        <AlertDescription className="text-amber-700">
          Archived documents can be restored or permanently deleted.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleManualRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <DocumentsList 
        documents={documents} 
        onDocumentDeleted={handleDocumentAction}
        onDocumentRestored={handleDocumentAction}
        isArchiveView={true}
      />
    </div>
  );
};

export default ArchivedDocumentsTab;
