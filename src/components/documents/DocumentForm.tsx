import React from 'react';
import DocumentFormContainer from './form/DocumentFormContainer';

interface DocumentFormProps {
  petId?: string;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = (props) => {
  return <DocumentFormContainer {...props} />;
};

export default DocumentForm;
