import { useState } from 'react';
import { Document } from '@/utils/types';

export interface UseDocumentEditProps {
  onSuccess?: () => void;
}

export const useDocumentEdit = ({ onSuccess }: UseDocumentEditProps = {}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  console.log('[useDocumentEdit] Hook initialized');

  const handleOpenEditDialog = (document: Document) => {
    console.log('[useDocumentEdit] handleOpenEditDialog called with:', document);
    
    // Log the state before changes
    console.log('[useDocumentEdit] Before state change - isEditDialogOpen:', isEditDialogOpen);
    console.log('[useDocumentEdit] Before state change - selectedDocument:', selectedDocument);
    
    setSelectedDocument(document);
    setIsEditDialogOpen(true);
    
    // Log after setting state (note: this won't show the updated state due to React's batching)
    console.log('[useDocumentEdit] After state change (before render) - document set and dialog opened');
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  // This function will be called after a successful edit
  const handleEditSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  return {
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedDocument,
    setSelectedDocument,
    handleOpenEditDialog,
    handleCloseEditDialog,
    handleEditSuccess,
  };
};
