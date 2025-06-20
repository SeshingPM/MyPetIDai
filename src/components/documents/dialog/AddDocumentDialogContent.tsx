import React from 'react';
// Desktop-only implementation since iOS and Android now have their own routes
import DesktopDocumentDialog from './DesktopDocumentDialog';

interface AddDocumentDialogContentProps {
  petId?: string;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Document upload dialog content for desktop users
 * 
 * iOS and Android users are now redirected to their own dedicated pages via
 * the AddDocumentDialog component using useEffect and navigation.
 */
const AddDocumentDialogContent: React.FC<AddDocumentDialogContentProps> = (props) => {
  return <DesktopDocumentDialog {...props} />;
};

export default AddDocumentDialogContent;
