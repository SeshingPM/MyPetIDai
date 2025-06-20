import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useDocumentRefresh } from '@/utils/document-api/refresh';
import logger from '@/utils/logger';

interface UseDocumentDialogStateProps {
  petId?: string;
  onDocumentAdded: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useDocumentDialogState = ({ 
  petId, 
  onDocumentAdded, 
  onOpenChange 
}: UseDocumentDialogStateProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { refreshDocuments } = useDocumentRefresh();

  // Reset upload state when dialog opens
  useEffect(() => {
    setIsUploading(false);
    setUploadComplete(false);
  }, []);

  // Handle successful document upload
  const handleSuccess = useCallback(async () => {
    const uploadId = Math.random().toString(36).substring(2, 8);
    logger.info(`[AddDocument ${uploadId}] Document uploaded successfully, starting refresh sequence`);
    
    if (uploadComplete) {
      logger.info(`[AddDocument ${uploadId}] Upload already marked complete, skipping duplicate refresh`);
      return;
    }
    
    try {
      // Mark upload as complete to prevent duplicate refreshes
      setUploadComplete(true);
      
      // Force immediate document refresh with multiple strategies
      await refreshDocuments({ 
        petId, 
        showToast: false,
        forceRefetch: true 
      });
      
      logger.info(`[AddDocument ${uploadId}] Document refresh sequence completed`);
      
      // Call the parent's success handler
      onDocumentAdded();
      
      // Close the dialog after a short delay
      setTimeout(() => {
        logger.info(`[AddDocument ${uploadId}] Closing dialog after successful upload`);
        onOpenChange(false);
      }, 800);
    } catch (error) {
      logger.error(`[AddDocument ${uploadId}] Error during refresh:`, error);
      toast.error("Document uploaded but there was an error refreshing the view.");
      
      // Still close the dialog even if refresh fails
      setTimeout(() => onOpenChange(false), 500);
    } finally {
      setIsUploading(false);
    }
  }, [petId, refreshDocuments, onDocumentAdded, onOpenChange, uploadComplete]);

  // Handle dialog close
  const handleDialogOpenChange = (newOpen: boolean) => {
    // Only allow closing if not currently uploading
    if (isUploading && !newOpen) {
      toast.warning("Please wait until upload completes");
      return;
    }
    
    // Reset the upload state when closing
    if (!newOpen && uploadComplete) {
      setUploadComplete(false);
    }
    
    onOpenChange(newOpen);
  };
  
  return {
    isUploading,
    setIsUploading,
    uploadComplete,
    handleSuccess,
    handleDialogOpenChange
  };
};
