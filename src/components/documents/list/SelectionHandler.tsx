import React from 'react';
import { Document } from '@/utils/types';
import BulkActionBar from '@/components/documents/list/BulkActionBar';
import { useDocumentSelection } from '@/components/documents/context/DocumentSelectionContext';
import logger from '@/utils/logger';

interface SelectionHandlerProps {
  onBulkActionComplete: () => void;
  isArchiveView?: boolean;
}

/**
 * Handles document selection and displays the bulk action bar when documents are selected
 */
const SelectionHandler: React.FC<SelectionHandlerProps> = ({ 
  onBulkActionComplete,
  isArchiveView = false
}) => {
  try {
    const { selectedDocuments, clearSelection } = useDocumentSelection();
    
    if (selectedDocuments.length === 0) {
      return null;
    }

    return (
      <BulkActionBar 
        selectedCount={selectedDocuments.length} 
        onClearSelection={clearSelection}
        onBulkActionComplete={onBulkActionComplete}
        isArchiveView={isArchiveView}
      />
    );
  } catch (error) {
    logger.error("SelectionHandler used outside DocumentSelectionProvider", error);
    return null;
  }
};

export default SelectionHandler;
