import React from 'react';
import { useDocumentSelection } from '../context/DocumentSelectionContext';
import { useBulkActions } from './bulk-actions/useBulkActions';
import BulkActionBarRegular from './bulk-actions/BulkActionBarRegular';
import BulkActionBarArchive from './bulk-actions/BulkActionBarArchive';
import logger from '@/utils/logger';

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkActionComplete: () => void;
  isArchiveView?: boolean;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({ 
  selectedCount,
  onClearSelection,
  onBulkActionComplete,
  isArchiveView = false
}) => {
  // Try to use the context, but handle the case when it's not available
  try {
    const { selectedDocuments } = useDocumentSelection();
    
    // Use our custom hook for bulk actions
    const {
      handleBulkArchive,
      handleBulkRestore,
      handleBulkPermanentDelete,
      handleBulkDownload,
      handleBulkEmail,
      handleBulkFavorite
    } = useBulkActions({
      selectedDocuments,
      onClearSelection,
      onBulkActionComplete
    });

    if (selectedCount === 0) {
      return null;
    }

    return (
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
        <div className="text-sm font-medium">
          {selectedCount} {selectedCount === 1 ? 'document' : 'documents'} selected
        </div>
        
        {isArchiveView ? (
          <BulkActionBarArchive 
            selectedDocuments={selectedDocuments}
            handleBulkRestore={handleBulkRestore}
            handleBulkPermanentDelete={handleBulkPermanentDelete}
            handleBulkDownload={handleBulkDownload}
          />
        ) : (
          <BulkActionBarRegular 
            selectedDocuments={selectedDocuments}
            handleBulkArchive={handleBulkArchive}
            handleBulkDownload={handleBulkDownload}
            handleBulkEmail={handleBulkEmail}
            handleBulkFavorite={handleBulkFavorite}
          />
        )}
      </div>
    );
  } catch (error) {
    logger.error("BulkActionBar used outside DocumentSelectionProvider", error);
    return null;
  }
};

export default BulkActionBar;
