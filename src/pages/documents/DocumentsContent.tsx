import React, { useCallback, useRef, memo, useEffect } from 'react';
import { Document } from '@/utils/types';
import DocumentsHeader from '@/components/documents/DocumentsHeader';
import DocumentsTabsWrapper from './components/DocumentsTabsWrapper';
import { useDocumentsData } from './hooks/useDocumentsData';
import { useOptimizedDocumentSync } from './hooks/useOptimizedDocumentSync';
import { useDocumentEdit } from '@/hooks/useDocumentEdit';
import logger from '@/utils/logger';
import { toggleDocumentFavorite } from '@/utils/document-api/update';
import EditDocumentDialog from '@/components/documents/edit/EditDocumentDialog';

interface DocumentsContentProps {
  onAddDocument: () => void;
  onEmailDocument: (document: Document) => void;
  onShareDocument: (document: Document) => void;
  refreshTrigger?: number;
}

const DocumentsContent: React.FC<DocumentsContentProps> = ({
  onAddDocument,
  onEmailDocument,
  onShareDocument,
  refreshTrigger = 0
}) => {
  const contentId = useRef(Math.random().toString(36).substring(2, 8)).current;
  
  // Get documents data and refresh handlers with optimized caching
  const {
    documents,
    isLoading,
    error,
    refetch,
    refreshKey,
    setRefreshKey,
    refreshDocuments
  } = useDocumentsData({
    refreshTrigger,
    contentId,
    staleTime: 1000 * 60 * 2 // 2 minutes
  });
  
  // Set up optimized cross-tab synchronization
  useOptimizedDocumentSync({
    contentId,
    setRefreshKey,
    refreshDocuments: async ({ showToast }) => {
      await refreshDocuments({ showToast });
    }
  });
  
  // Log documents for debugging
  useEffect(() => {
    logger.info(`[DocumentsContent ${contentId}] Rendered with ${documents?.length || 0} documents`);
  }, [documents, contentId]);
  
  // Handler for bookmarking/unbookmarking documents
  const handleToggleFavorite = useCallback(async (document: Document) => {
    logger.info(`[DocumentsContent ${contentId}] Toggling favorite for document: ${document.id}`);
    
    try {
      // Create the new status (opposite of current)
      const newStatus = !document.isFavorite;
      
      // Call API to toggle favorite status
      // We pass the current status, the API will toggle it to the opposite
      await toggleDocumentFavorite(document.id, !!document.isFavorite);
      
      // Immediately refresh documents to get updated state
      await refreshDocuments({ showToast: false });
      
      // Log success message
      const actionText = newStatus ? 'bookmarked' : 'removed from bookmarks';
      logger.info(`Document ${document.id} ${actionText} successfully`);
    } catch (error) {
      logger.error(`[DocumentsContent ${contentId}] Error toggling favorite:`, error);
    }
  }, [contentId, refreshDocuments]);

  // Manual refresh handler - optimized with useCallback
  const handleRefresh = useCallback(async () => {
    logger.info(`[DocumentsContent ${contentId}] Manual refresh triggered`);
    
    try {
      // Update the refresh key to trigger a refetch
      setRefreshKey(Date.now());
      
      // Force immediate refetch
      await refetch();
      
      // Use our common refresh function for a thorough refresh
      await refreshDocuments({ showToast: true });
    } catch (error) {
      logger.error(`[DocumentsContent ${contentId}] Error during refresh:`, error);
    }
  }, [refreshDocuments, refetch, contentId, setRefreshKey]);
  
  // Document edit functionality
  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedDocument,
    handleOpenEditDialog,
  } = useDocumentEdit({
    onSuccess: handleRefresh
  });

  // Handler for editing documents
  const handleEditDocument = useCallback((document: Document) => {
    logger.info(`[DocumentsContent ${contentId}] Opening edit dialog for document: ${document.id}`);
    handleOpenEditDialog(document);
  }, [contentId, handleOpenEditDialog]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <DocumentsHeader onAddDocument={onAddDocument} onRefresh={handleRefresh} />
      
      <DocumentsTabsWrapper
        documents={documents}
        isLoading={isLoading}
        error={error}
        onRefresh={handleRefresh}
        onAddDocument={onAddDocument}
        onEmailDocument={onEmailDocument}
        onShareDocument={onShareDocument}
        onToggleFavorite={handleToggleFavorite}
        onEditDocument={handleEditDocument}
      />

      {/* Edit Document Dialog */}
      <EditDocumentDialog 
        document={selectedDocument}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default memo(DocumentsContent);
