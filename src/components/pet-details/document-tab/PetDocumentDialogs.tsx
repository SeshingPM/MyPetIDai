
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Document } from '@/utils/types';
import AddDocumentDialogContent from '@/components/documents/dialog/AddDocumentDialogContent';
import EmailDocumentDialog from '@/components/documents/EmailDocumentDialog';
import ShareDocumentDialog from '@/components/documents/ShareDocumentDialog';
import { useDocumentDialogState } from '@/components/documents/dialog/useDocumentDialogState';

interface PetDocumentDialogsProps {
  isAddDocumentOpen: boolean;
  isEmailDocumentOpen: boolean;
  isShareDocumentOpen: boolean;
  isEditDocumentOpen?: boolean;
  setIsAddDocumentOpen: (isOpen: boolean) => void;
  setIsEmailDocumentOpen: (isOpen: boolean) => void;
  setIsShareDocumentOpen: (isOpen: boolean) => void;
  setIsEditDocumentOpen?: (isOpen: boolean) => void;
  selectedDocument: Document | null;
  petId: string;
  onDocumentAdded: () => void;
}

const PetDocumentDialogs: React.FC<PetDocumentDialogsProps> = ({
  isAddDocumentOpen,
  isEmailDocumentOpen,
  isShareDocumentOpen,
  setIsAddDocumentOpen,
  setIsEmailDocumentOpen,
  setIsShareDocumentOpen,
  selectedDocument,
  petId,
  onDocumentAdded
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const { handleSuccess, handleDialogOpenChange } = useDocumentDialogState({
    petId,
    onDocumentAdded,
    onOpenChange: setIsAddDocumentOpen
  });

  return (
    <>
      <Dialog open={isAddDocumentOpen} onOpenChange={handleDialogOpenChange}>
        <AddDocumentDialogContent
          petId={petId}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          onSuccess={handleSuccess}
          onCancel={() => setIsAddDocumentOpen(false)}
        />
      </Dialog>

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
    </>
  );
};

export default PetDocumentDialogs;
