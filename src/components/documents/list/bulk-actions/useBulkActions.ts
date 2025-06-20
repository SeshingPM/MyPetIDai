import { useState, useCallback } from "react";
import { Document } from "@/utils/types";
import { toast } from "sonner";
import {
  bulkArchiveDocuments,
  bulkDownloadDocuments,
  bulkPermanentlyDeleteDocuments,
  bulkRestoreDocuments,
} from "@/utils/bulk-document-operations";
import { toggleDocumentBookmark } from "@/utils/document-api/update";

interface UseBulkActionsProps {
  selectedDocuments: Document[];
  onClearSelection: () => void;
  onBulkActionComplete: () => void;
}

export const useBulkActions = ({
  selectedDocuments,
  onClearSelection,
  onBulkActionComplete,
}: UseBulkActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBulkArchive = useCallback(async () => {
    if (selectedDocuments.length === 0 || isProcessing) return false;

    try {
      setIsProcessing(true);
      const success = await bulkArchiveDocuments(selectedDocuments);

      if (success) {
        onClearSelection();
        // Delay to ensure UI updates properly
        setTimeout(() => {
          onBulkActionComplete();
          toast.success(
            `${selectedDocuments.length} documents moved to archive`
          );
        }, 500);
      }
      return success;
    } catch (error) {
      console.error("Error archiving documents:", error);
      toast.error("Failed to archive documents");
      return false;
    } finally {
      // Additional delay to ensure UI stability
      setTimeout(() => {
        setIsProcessing(false);
      }, 800);
    }
  }, [selectedDocuments, isProcessing, onClearSelection, onBulkActionComplete]);

  const handleBulkRestore = useCallback(async () => {
    if (selectedDocuments.length === 0 || isProcessing) return false;

    try {
      setIsProcessing(true);
      const success = await bulkRestoreDocuments(selectedDocuments);

      if (success) {
        onClearSelection();
        // Delay to ensure UI updates properly
        setTimeout(() => {
          onBulkActionComplete();
          toast.success(`${selectedDocuments.length} documents restored`);
        }, 500);
      }
      return success;
    } catch (error) {
      console.error("Error restoring documents:", error);
      toast.error("Failed to restore documents");
      return false;
    } finally {
      // Additional delay to ensure UI stability
      setTimeout(() => {
        setIsProcessing(false);
      }, 800);
    }
  }, [selectedDocuments, isProcessing, onClearSelection, onBulkActionComplete]);

  const handleBulkPermanentDelete = useCallback(async (): Promise<boolean> => {
    if (selectedDocuments.length === 0 || isProcessing) return false;

    try {
      setIsProcessing(true);

      // Validate document IDs before proceeding
      if (selectedDocuments.some((doc) => !doc.id)) {
        console.error("Invalid document IDs found");
        toast.error("Some documents could not be processed");
        return false;
      }

      const success = await bulkPermanentlyDeleteDocuments(selectedDocuments);

      if (success) {
        onClearSelection();

        // Use a longer delay for permanent deletion to ensure everything completes
        setTimeout(() => {
          onBulkActionComplete();
          toast.success(
            `${selectedDocuments.length} documents permanently deleted`
          );
        }, 800);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting documents:", error);
      toast.error("Failed to delete documents");
      return false;
    } finally {
      // Extended delay to prevent UI issues
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    }
  }, [selectedDocuments, isProcessing, onClearSelection, onBulkActionComplete]);

  const handleBulkDownload = useCallback(() => {
    if (selectedDocuments.length === 0 || isProcessing) return;

    try {
      bulkDownloadDocuments(selectedDocuments);
    } catch (error) {
      console.error("Error downloading documents:", error);
      toast.error("Failed to download documents");
    }
  }, [selectedDocuments, isProcessing]);

  const handleBulkEmail = useCallback(() => {
    if (selectedDocuments.length === 0 || isProcessing) return;

    try {
      // Email functionality would go here
      console.log(
        "Emailing documents:",
        selectedDocuments.map((d) => d.id)
      );
      toast.success(`Preparing to email ${selectedDocuments.length} documents`);
    } catch (error) {
      console.error("Error emailing documents:", error);
      toast.error("Failed to prepare email");
    }
  }, [selectedDocuments, isProcessing]);

  const handleBulkFavorite = useCallback(async () => {
    if (selectedDocuments.length === 0 || isProcessing) return;

    try {
      setIsProcessing(true);

      // Process documents in batches for better reliability
      let successCount = 0;
      for (const doc of selectedDocuments) {
        try {
          // Use the toggleDocumentBookmark function with showToast=false
          await toggleDocumentBookmark(doc.id, false, false);
          successCount++;
        } catch (err) {
          console.error(`Error bookmarking document ${doc.id}:`, err);
        }
      }

      // Show success message - AppToaster will filter this if needed
      if (successCount > 0) {
        toast.success(`${successCount} documents bookmarked`);
        onBulkActionComplete();
      } else {
        toast.error("Failed to bookmark documents");
      }

      // Clear selection
      onClearSelection();
    } catch (error) {
      console.error("Error bookmarking documents:", error);
      toast.error("Failed to bookmark documents");
    } finally {
      setIsProcessing(false);
    }
  }, [selectedDocuments, isProcessing, onClearSelection, onBulkActionComplete]);

  return {
    isProcessing,
    handleBulkArchive,
    handleBulkRestore,
    handleBulkPermanentDelete,
    handleBulkDownload,
    handleBulkEmail,
    handleBulkFavorite,
  };
};
