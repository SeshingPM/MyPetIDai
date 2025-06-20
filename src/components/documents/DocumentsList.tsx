import React, { useCallback } from "react";
import { Document } from "@/utils/types";
import { useDocumentSelection } from "@/components/documents/context/DocumentSelectionContext";
import SelectionHandler from "./list/SelectionHandler";
import DocumentsGridList from "./list/DocumentsGridList";
import ListContextProvider from "./list/ListContextProvider";
import { toast } from "sonner";
import logger from "@/utils/logger";

interface DocumentsListProps {
  documents: Document[];
  onDocumentDeleted: () => void;
  onDocumentRestored?: () => void;
  onToggleBookmark?: (document: Document) => void;
  onToggleFavorite?: (document: Document) => void;
  onEmailDocument?: (document: Document) => void;
  onShareDocument?: (document: Document) => void;
  onEditDocument?: (document: Document) => void;
  isArchiveView?: boolean;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  onDocumentDeleted,
  onDocumentRestored,
  onToggleBookmark,
  onToggleFavorite,
  onEmailDocument,
  onShareDocument,
  onEditDocument,
  isArchiveView = false,
}) => {
  const handleDocumentAction = useCallback(() => {
    try {
      // Try to use the selection context in a safer way
      try {
        const { clearSelection } = useDocumentSelection();
        clearSelection();
      } catch (error) {
        // Ignore errors from context - it might not be available
        logger.info("No selection context available, continuing with action");
      }

      // After a small delay to ensure UI has time to update
      setTimeout(() => {
        onDocumentDeleted();
      }, 300);
    } catch (error) {
      logger.error("Error handling document action:", error);
      toast.error("An error occurred. Please try again.");
    }
  }, [onDocumentDeleted]);

  const handleDocumentRestore = useCallback(() => {
    if (!onDocumentRestored) return;

    try {
      // Try to use the selection context in a safer way
      try {
        const { clearSelection } = useDocumentSelection();
        clearSelection();
      } catch (error) {
        // Ignore errors from context - it might not be available
        logger.info("No selection context available, continuing with restore");
      }

      // After a small delay to ensure UI has time to update
      setTimeout(() => {
        onDocumentRestored();
      }, 300);
    } catch (error) {
      logger.error("Error handling document restore:", error);
      toast.error("An error occurred while restoring. Please try again.");
    }
  }, [onDocumentRestored]);

  // Use the new handler if available, otherwise fall back to the old one
  const bookmarkHandler = onToggleBookmark || onToggleFavorite;

  // Try to render with selection context, fallback to basic rendering if not available
  try {
    // This will throw if not in DocumentSelectionProvider context
    useDocumentSelection();

    return (
      <div className="space-y-4">
        <SelectionHandler
          onBulkActionComplete={
            isArchiveView
              ? onDocumentRestored || onDocumentDeleted
              : onDocumentDeleted
          }
          isArchiveView={isArchiveView}
        />

        <DocumentsGridList
          documents={documents}
          onDocumentDeleted={handleDocumentAction}
          onDocumentRestored={handleDocumentRestore}
          onToggleBookmark={bookmarkHandler}
          onEmailDocument={onEmailDocument}
          onShareDocument={onShareDocument}
          onEditDocument={onEditDocument}
          isArchiveView={isArchiveView}
        />
      </div>
    );
  } catch (error) {
    logger.info(
      "DocumentsList used outside DocumentSelectionProvider - using fallback"
    );

    // Fallback rendering without selection functionality
    return (
      <ListContextProvider>
        <div className="space-y-4">
          <DocumentsGridList
            documents={documents}
            onDocumentDeleted={handleDocumentAction}
            onDocumentRestored={handleDocumentRestore}
            onToggleBookmark={bookmarkHandler}
            onEmailDocument={onEmailDocument}
            onShareDocument={onShareDocument}
            onEditDocument={onEditDocument}
            isArchiveView={isArchiveView}
            disableSelection={true}
          />
        </div>
      </ListContextProvider>
    );
  }
};

export default DocumentsList;
