
import { useState, useCallback, useRef } from 'react';
import { Document } from '@/utils/types';
import { archiveDocument, permanentlyDeleteDocument, restoreDocument } from '@/utils/document-api';
import { toast } from 'sonner';

interface UseDocumentOperationsProps {
  document: Document;
  onDelete?: () => void;
  onRestore?: () => void;
  onPermanentDelete?: () => void;
  isArchiveView?: boolean;
}

export const useDocumentOperations = ({
  document,
  onDelete,
  onRestore,
  onPermanentDelete,
  isArchiveView = false
}: UseDocumentOperationsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const isMounted = useRef(true);

  // Set up cleanup to prevent state updates after unmount
  useCallback(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const safeSetState = useCallback((cb: (prev: boolean) => boolean) => {
    if (isMounted.current) {
      setIsProcessing(cb);
    }
  }, []);

  const handleArchive = useCallback(async () => {
    if (isProcessing || !document.id) return false;
    
    try {
      safeSetState(() => true);
      const success = await archiveDocument(document.id);
      
      if (success && onDelete) {
        // Small delay to allow UI to update properly
        setTimeout(() => {
          if (isMounted.current && onDelete) {
            onDelete();
          }
        }, 300);
      }
      return success;
    } catch (error) {
      console.error('Error archiving document:', error);
      if (isMounted.current) {
        toast.error('Error archiving document. Please try again.');
      }
      return false;
    } finally {
      // Additional delay to prevent UI issues
      setTimeout(() => {
        safeSetState(() => false);
      }, 500);
    }
  }, [document.id, isProcessing, onDelete, safeSetState]);

  const handleRestore = useCallback(async () => {
    if (isProcessing || !document.id) return false;
    
    try {
      safeSetState(() => true);
      const success = await restoreDocument(document.id);
      
      if (success && onRestore) {
        // Small delay to allow UI to update properly
        setTimeout(() => {
          if (isMounted.current && onRestore) {
            onRestore();
          }
        }, 300);
      }
      return success;
    } catch (error) {
      console.error('Error restoring document:', error);
      if (isMounted.current) {
        toast.error('Error restoring document. Please try again.');
      }
      return false;
    } finally {
      // Additional delay to prevent UI issues
      setTimeout(() => {
        safeSetState(() => false);
      }, 500);
    }
  }, [document.id, isProcessing, onRestore, safeSetState]);

  const handlePermanentDelete = useCallback(async (): Promise<boolean> => {
    if (isProcessing || !document.id) return false;
    
    try {
      safeSetState(() => true);
      // Pre-validation to ensure document exists
      if (!document.id) {
        if (isMounted.current) {
          toast.error('Invalid document. Please try again.');
        }
        return false;
      }
      
      const success = await permanentlyDeleteDocument(document.id);
      
      if (success && onPermanentDelete) {
        // Use a longer delay for permanent deletion to ensure everything completes
        setTimeout(() => {
          if (isMounted.current && onPermanentDelete) {
            onPermanentDelete();
          }
        }, 300);
      }
      return success;
    } catch (error) {
      console.error('Error permanently deleting document:', error);
      if (isMounted.current) {
        toast.error('Error deleting document. Please try again.');
      }
      return false;
    } finally {
      // Additional delay to prevent UI issues
      setTimeout(() => {
        safeSetState(() => false);
      }, 500);
    }
  }, [document.id, isProcessing, onPermanentDelete, safeSetState]);

  return {
    handleArchive,
    handleRestore,
    handlePermanentDelete,
    isProcessing
  };
};
