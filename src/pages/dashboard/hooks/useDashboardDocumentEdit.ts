import { useState, useCallback } from 'react';
import { Document } from '@/utils/types';
import { updateDocument } from '@/utils/document-api/update';
import { toast } from 'sonner';

export const useDashboardDocumentEdit = (onSuccessRefresh?: () => void) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Explicitly open the edit dialog with a document
  const openEditDialog = useCallback((document: Document) => {
    console.log('[useDashboardDocumentEdit] Opening edit dialog for document:', document.id);
    setSelectedDocument(document);
    setIsEditDialogOpen(true);
  }, []);

  // Close the edit dialog
  const closeEditDialog = useCallback(() => {
    console.log('[useDashboardDocumentEdit] Closing edit dialog');
    setIsEditDialogOpen(false);
    setTimeout(() => setSelectedDocument(null), 300); // Clear after animation
  }, []);

  // Handle document updates
  const handleUpdateDocument = useCallback(async (
    formData: { id: string; name: string; category: string; petId: string }
  ) => {
    console.log('[useDashboardDocumentEdit] Updating document:', formData);
    
    try {
      setIsSubmitting(true);
      
      const { id, ...updates } = formData;
      
      // Process the petId value - convert 'none' to null
      const processedUpdates = {
        ...updates,
        petId: updates.petId === 'none' ? null : updates.petId
      };
      
      const success = await updateDocument(id, processedUpdates);
      
      if (success) {
        toast.success('Document updated successfully');
        closeEditDialog();
        
        if (onSuccessRefresh) {
          console.log('[useDashboardDocumentEdit] Calling refresh callback');
          onSuccessRefresh();
        }
      } else {
        toast.error('Failed to update document');
      }
    } catch (error) {
      console.error('[useDashboardDocumentEdit] Error updating document:', error);
      toast.error('An error occurred while updating the document');
    } finally {
      setIsSubmitting(false);
    }
  }, [closeEditDialog, onSuccessRefresh]);

  return {
    isEditDialogOpen,
    selectedDocument,
    isSubmitting,
    openEditDialog,
    closeEditDialog,
    handleUpdateDocument
  };
};
