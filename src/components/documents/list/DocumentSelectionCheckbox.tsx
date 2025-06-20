import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Document } from '@/utils/types';
import { useDocumentSelection } from '../context/DocumentSelectionContext';
import { CheckedState } from '@radix-ui/react-checkbox';
import logger from '@/utils/logger';

interface DocumentSelectionCheckboxProps {
  document: Document;
}

const DocumentSelectionCheckbox: React.FC<DocumentSelectionCheckboxProps> = ({ document }) => {
  try {
    const { toggleDocumentSelection, isDocumentSelected } = useDocumentSelection();
    
    const handleChange = (checked: CheckedState) => {
      toggleDocumentSelection(document);
    };
    
    return (
      <Checkbox 
        checked={isDocumentSelected(document)}
        onCheckedChange={handleChange}
        className="mr-2"
      />
    );
  } catch (error) {
    logger.error("DocumentSelectionCheckbox used outside DocumentSelectionProvider", error);
    return null;
  }
};

export default DocumentSelectionCheckbox;
