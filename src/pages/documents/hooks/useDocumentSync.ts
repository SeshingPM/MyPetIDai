
import { useEffect } from 'react';
import { RefreshResult } from '@/utils/document-api/refresh/types';

interface UseDocumentSyncProps {
  contentId: string;
  setRefreshKey: (key: number) => void;
  refreshDocuments: (options: { showToast: boolean }) => Promise<RefreshResult | void>;
}

export const useDocumentSync = ({ 
  contentId, 
  setRefreshKey, 
  refreshDocuments 
}: UseDocumentSyncProps) => {
  
  // Set up window focus and storage event listeners for cross-tab synchronization
  useEffect(() => {
    // Listen for document updates from storage events (cross-tab)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'document_updated') {
        console.log(`[DocumentsContent ${contentId}] Document update detected from another tab, refreshing...`);
        setRefreshKey(Date.now());
        refreshDocuments({ showToast: false });
      }
    };
    
    // Listen for window focus to refresh data
    const handleWindowFocus = () => {
      console.log(`[DocumentsContent ${contentId}] Window focused, refreshing documents`);
      setRefreshKey(Date.now());
      refreshDocuments({ showToast: false });
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleWindowFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [refreshDocuments, contentId, setRefreshKey]);
};
