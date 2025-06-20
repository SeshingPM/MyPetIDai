
import React, { useState, useCallback, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import AddDocumentDialog from '@/components/documents/AddDocumentDialog';
import EmailDocumentDialog from '@/components/documents/EmailDocumentDialog';
import ShareDocumentDialog from '@/components/documents/share/ShareDocumentDialog';
import { Document } from '@/utils/types';
import { DocumentSelectionProvider } from '@/components/documents/context/DocumentSelectionContext';
import DocumentsContent from '@/pages/documents/DocumentsContent';
import { PetsProvider } from '@/contexts/pets';
import { useDocumentRefresh } from '@/utils/document-api/refresh';

const Documents: React.FC = () => {
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isEmailDocumentOpen, setIsEmailDocumentOpen] = useState(false);
  const [isShareDocumentOpen, setIsShareDocumentOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { refreshDocuments } = useDocumentRefresh();
  const queryClient = useQueryClient();
  
  // Initialize component with a single load on mount, no auto-refresh
  useEffect(() => {
    console.log('[Documents] Main documents page mounted');
    
    // Load data once on mount, no recurring refreshes
    const loadOnMount = async () => {
      console.log('[Documents] Performing initial data load');
      
      try {
        // Single fetch on mount - no invalidation or refresh triggers
        await queryClient.fetchQuery({
          queryKey: ['documents', 'all'],
          queryFn: () => import('@/utils/document-api/fetch').then(m => m.fetchAllDocuments(false)),
          staleTime: 5 * 60 * 1000 // 5 minutes - prevent frequent refetching
        });
      } catch (err) {
        console.error('[Documents] Error loading documents:', err);
      }
    };
    
    loadOnMount();
    
    // Keep cross-tab sync for critical updates only
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'document_updated') {
        console.log('[Documents] Detected document update from localStorage');
        // Only update the trigger, no automatic refetch
        setRefreshTrigger(Date.now());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      console.log('[Documents] Main documents page unmounted');
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [queryClient]);
  
  // Handle document added with optimized refresh sequence
  const handleDocumentAdded = useCallback(() => {
    console.log('[Documents] Document added successfully, triggering refresh with timestamp', Date.now());
    
    // Force immediate invalidation and refresh
    queryClient.invalidateQueries({
      queryKey: ['documents'],
      exact: false,
      refetchType: 'all'
    });
    
    // Trigger immediate UI refresh
    setRefreshTrigger(Date.now());
    
    // Use prioritized refresh mechanism
    refreshDocuments({ 
      showToast: false,
      forceRefetch: true
    });
    
    // Close the dialog
    setIsAddDocumentOpen(false);
  }, [refreshDocuments, queryClient]);

  const handleEmailDocument = (document: Document) => {
    try {
      setSelectedDocument(document);
      setIsEmailDocumentOpen(true);
    } catch (error) {
      console.error('[Documents] Error selecting document for email:', error);
      toast.error('Failed to prepare document for email');
    }
  };

  const handleShareDocument = (document: Document) => {
    try {
      setSelectedDocument(document);
      setIsShareDocumentOpen(true);
    } catch (error) {
      console.error('[Documents] Error selecting document for sharing:', error);
      toast.error('Failed to prepare document for sharing');
    }
  };

  return (
    <DashboardLayout>
      <div className="relative isolate overflow-hidden">
        {/* Background blurs */}
        <div className="absolute -top-40 -right-20 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute top-60 -left-20 w-80 h-80 bg-pet-purple/20 rounded-full filter blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 right-10 w-60 h-60 bg-pet-blue/20 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        
        <PetsProvider>
          <DocumentSelectionProvider>
            <DocumentsContent
              onAddDocument={() => setIsAddDocumentOpen(true)}
              onEmailDocument={handleEmailDocument}
              onShareDocument={handleShareDocument}
              refreshTrigger={refreshTrigger}
            />
          </DocumentSelectionProvider>
        </PetsProvider>
      </div>
      
      <AddDocumentDialog
        open={isAddDocumentOpen}
        onOpenChange={setIsAddDocumentOpen}
        onDocumentAdded={handleDocumentAdded}
      />

      <EmailDocumentDialog
        open={isEmailDocumentOpen}
        onOpenChange={setIsEmailDocumentOpen}
        document={selectedDocument}
      />

      <ShareDocumentDialog
        open={isShareDocumentOpen}
        onOpenChange={setIsShareDocumentOpen}
        document={selectedDocument}
      />
    </DashboardLayout>
  );
};

export default Documents;
