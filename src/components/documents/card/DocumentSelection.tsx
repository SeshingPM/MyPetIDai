
import React from 'react';
import { Document } from '@/utils/types';
import DocumentSelectionCheckbox from '../list/DocumentSelectionCheckbox';
import { useDocumentSelection } from '../context/DocumentSelectionContext';

interface DocumentSelectionProps {
  document: Document;
}

const DocumentSelection: React.FC<DocumentSelectionProps> = ({ document }) => {
  // Try to use the context, but handle the case when it's not available
  try {
    const { isDocumentSelected } = useDocumentSelection();
    
    const handleSelectClick = (e: React.MouseEvent) => {
      // Stop propagation to prevent card click from triggering
      e.preventDefault();
      e.stopPropagation();
    };

    return (
      <div 
        onClick={handleSelectClick} 
        className="selection-control" 
        aria-label="Select document"
      >
        <DocumentSelectionCheckbox document={document} />
      </div>
    );
  } catch (error) {
    // If we're not in a document selection context, render nothing
    console.log('DocumentSelection used outside context:', error);
    return null;
  }
};

export default DocumentSelection;
