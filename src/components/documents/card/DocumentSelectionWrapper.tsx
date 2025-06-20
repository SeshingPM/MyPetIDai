
import React from 'react';
import { Document } from '@/utils/types';
import DocumentSelection from './DocumentSelection';

interface DocumentSelectionWrapperProps {
  document: Document;
  disableSelection: boolean;
}

const DocumentSelectionWrapper: React.FC<DocumentSelectionWrapperProps> = ({ 
  document, 
  disableSelection 
}) => {
  if (disableSelection) {
    return null;
  }
  
  return (
    <div className="flex-shrink-0 selection-control mt-1" onClick={(e) => e.stopPropagation()}>
      <DocumentSelection document={document} />
    </div>
  );
};

export default DocumentSelectionWrapper;
