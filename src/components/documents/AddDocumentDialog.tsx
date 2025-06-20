import React, { useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useDocumentDialogState } from './dialog/useDocumentDialogState';
import AddDocumentDialogContent from './dialog/AddDocumentDialogContent';
import { useNavigate } from 'react-router-dom';
import { usePlatform } from '@/contexts/PlatformContext';

interface AddDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentAdded: () => void;
  petId?: string; // Pet ID to associate the document with
}

const AddDocumentDialog: React.FC<AddDocumentDialogProps> = ({ 
  open, 
  onOpenChange,
  onDocumentAdded,
  petId
}) => {
  const navigate = useNavigate();
  const { isIOS, isAndroid } = usePlatform();
  
  // Use a single handler pattern with useDocumentDialogState
  const {
    isUploading,
    setIsUploading,
    handleSuccess,
    handleDialogOpenChange
  } = useDocumentDialogState({
    petId,
    onDocumentAdded,
    onOpenChange
  });

  // Route users to platform-specific pages
  useEffect(() => {
    if (!open) return;
    
    if (isIOS) {
      // Navigate iOS users to a dedicated page
      onOpenChange(false); // Close the dialog
      navigate('/ios-upload'); // Navigate to iOS upload page
      return;
    }
    
    if (isAndroid) {
      // Navigate Android users to their dedicated page
      onOpenChange(false);
      navigate('/upload');
      return;
    }
  }, [open, isIOS, isAndroid, navigate, onOpenChange]);

  // Only desktop users see the dialog
  return (
    <Dialog 
      open={open} 
      onOpenChange={handleDialogOpenChange}
    >
      <AddDocumentDialogContent
        petId={petId}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        onSuccess={handleSuccess} // Single success handler
        onCancel={() => onOpenChange(false)}
      />
    </Dialog>
  );
};

export default AddDocumentDialog;
