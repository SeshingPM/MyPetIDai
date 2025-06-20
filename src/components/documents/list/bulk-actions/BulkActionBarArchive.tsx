
import React, { useState } from 'react';
import { Download, Undo, Trash2 } from 'lucide-react';
import { Document } from '@/utils/types';
import BulkActionButton from './BulkActionButton';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

interface BulkActionBarArchiveProps {
  selectedDocuments: Document[];
  handleBulkRestore: () => void;
  handleBulkPermanentDelete: () => Promise<boolean>;
  handleBulkDownload: () => void;
  isProcessing?: boolean;
}

const BulkActionBarArchive: React.FC<BulkActionBarArchiveProps> = ({
  selectedDocuments,
  handleBulkRestore,
  handleBulkPermanentDelete,
  handleBulkDownload,
  isProcessing = false
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [localProcessing, setLocalProcessing] = useState(false);
  
  const handleConfirmDelete = async () => {
    if (localProcessing) return;
    
    try {
      setLocalProcessing(true);
      const success = await handleBulkPermanentDelete();
      
      if (success) {
        setConfirmDelete(false);
      }
    } catch (error) {
      console.error('Error handling bulk delete:', error);
    } finally {
      // Add a small delay to ensure UI updates properly
      setTimeout(() => {
        setLocalProcessing(false);
      }, 500);
    }
  };
  
  const isDisabled = isProcessing || localProcessing;
  
  return (
    <div className="flex space-x-2">
      <BulkActionButton
        icon={Download}
        label="Download"
        onClick={handleBulkDownload}
        disabled={isDisabled}
      />
      
      <BulkActionButton
        icon={Undo}
        label="Restore"
        onClick={handleBulkRestore}
        disabled={isDisabled}
      />
      
      <BulkActionButton
        icon={Trash2}
        label="Delete"
        onClick={() => setConfirmDelete(true)}
        variant="destructive"
        disabled={isDisabled}
      />
      
      <DeleteConfirmationDialog
        selectedCount={selectedDocuments.length}
        onConfirmDelete={handleConfirmDelete}
        open={confirmDelete}
        setOpen={setConfirmDelete}
        title={`Permanently delete ${selectedDocuments.length} ${selectedDocuments.length === 1 ? 'document' : 'documents'}?`}
        description="This action cannot be undone. These documents will be permanently deleted from your account."
      />
    </div>
  );
};

export default BulkActionBarArchive;
