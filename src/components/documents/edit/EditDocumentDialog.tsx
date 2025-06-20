import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Document } from '@/utils/types';
import EditDocumentForm, { DocumentFormValues } from './EditDocumentForm';
import { updateDocument } from '@/utils/document-api/update';
import { toast } from 'sonner';

interface EditDocumentDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditDocumentDialog: React.FC<EditDocumentDialogProps> = ({
  document,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  console.log('[EditDocumentDialog] Rendering with props:', { documentId: document?.id, open });
  
  // Log document details if available
  if (document) {
    console.log('[EditDocumentDialog] Document details:', {
      id: document.id,
      name: document.name,
      category: document.category,
      petId: document.petId
    });
  } else {
    console.log('[EditDocumentDialog] No document provided');
    return null;
  }

  const handleSubmit = async (formData: DocumentFormValues & { id: string }) => {
    try {
      setIsSubmitting(true);
      
      const { id, ...updates } = formData;
      const success = await updateDocument(id, updates);
      
      if (success) {
        // Don't show success toast here to prevent duplicates
        // The EditDocumentMenuItem component is responsible for showing success messages
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error('Failed to update document');
      }
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('An error occurred while updating the document');
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log('[EditDocumentDialog] About to render dialog, open state:', open);

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpenState) => {
        console.log('[EditDocumentDialog] Dialog open state changing from', open, 'to', newOpenState);
        onOpenChange(newOpenState);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
        </DialogHeader>
        <EditDocumentForm 
          document={document}
          onSubmit={handleSubmit}
          onCancel={() => {
            console.log('[EditDocumentDialog] Cancel button clicked');
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditDocumentDialog;
