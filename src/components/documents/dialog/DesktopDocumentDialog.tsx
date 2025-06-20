import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogContent } from '@/components/ui/dialog';
import DocumentForm from '../DocumentForm';

interface DesktopDocumentDialogProps {
  petId?: string;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Desktop-specific document upload dialog with scanner functionality
 */
const DesktopDocumentDialog: React.FC<DesktopDocumentDialogProps> = (props) => {
  const { petId } = props;
  
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add New Document</DialogTitle>
        <DialogDescription>
          Upload a document for {petId ? "your pet's" : "your"} records
        </DialogDescription>
      </DialogHeader>
      
      <DocumentForm {...props} />
    </DialogContent>
  );
};

export default DesktopDocumentDialog;
