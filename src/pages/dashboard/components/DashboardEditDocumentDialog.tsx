import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Document } from '@/utils/types';
import EditDocumentForm, { DocumentFormValues } from '@/components/documents/edit/EditDocumentForm';

interface DashboardEditDocumentDialogProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: DocumentFormValues & { id: string }) => void;
  isSubmitting: boolean;
}

const DashboardEditDocumentDialog: React.FC<DashboardEditDocumentDialogProps> = ({
  document,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting
}) => {
  // If no document is provided, don't render the dialog
  if (!document) {
    console.log('[DashboardEditDocumentDialog] No document provided, not rendering');
    return null;
  }

  console.log('[DashboardEditDocumentDialog] Rendering with document:', document);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
        </DialogHeader>
        <EditDocumentForm
          document={document}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DashboardEditDocumentDialog;
