import React from "react";
import { Document } from "@/utils/types";
import DocumentCardContainer from "./card/DocumentCardContainer";
import DocumentCardLayout from "./card/DocumentCardLayout";
import { useDocumentOperations } from "@/hooks/useDocumentOperations";
import { toast } from "sonner";

interface DocumentCardProps {
  document: Document;
  onDelete?: () => void;
  onRestore?: () => void;
  onPermanentDelete?: () => void;
  onEmailDocument?: () => void;
  onToggleBookmark?: (document: Document) => void;
  onToggleFavorite?: (document: Document) => void;
  onShareDocument?: () => void;
  onEditDocument?: (document: Document) => void;
  disableSelection?: boolean;
  isArchiveView?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDelete,
  onRestore,
  onPermanentDelete,
  onEmailDocument,
  onToggleBookmark,
  onToggleFavorite,
  onShareDocument,
  onEditDocument,
  disableSelection = false,
  isArchiveView = false,
}) => {
  const { handleArchive, handleRestore, handlePermanentDelete } =
    useDocumentOperations({
      document,
      onDelete,
      onRestore,
      onPermanentDelete,
      isArchiveView,
    });

  const handleToggleBookmark = () => {
    if (onToggleBookmark) {
      onToggleBookmark(document);
    } else if (onToggleFavorite) {
      onToggleFavorite(document);
    }
  };

  const handleEditDocument = () => {
    console.log(
      "[DocumentCard] handleEditDocument called for document:",
      document.id
    );
    console.log("[DocumentCard] onEditDocument prop exists:", !!onEditDocument);

    // Dashboard-specific behavior (we detect by looking at the URL)
    const isDashboard = window?.location?.pathname?.includes("/dashboard");

    if (onEditDocument) {
      console.log("[DocumentCard] Calling onEditDocument with document");
      // Call the edit handler with the document object
      // This is important as the parent component needs the document to edit
      onEditDocument(document);
    } else if (!isDashboard) {
      // Only show the fallback message if we're NOT on the dashboard
      // this prevents the "Edit functionality coming soon!" message on the dashboard
      console.log(
        "[DocumentCard] No edit handler provided, showing fallback message"
      );
      toast.info("Edit functionality coming soon!");
    } else {
      console.log(
        "[DocumentCard] Dashboard detected but no edit handler, will use self-contained edit"
      );
      // In dashboard view the ActionMenu component's self-contained EditDocumentMenuItem will take over
    }
  };

  return (
    <DocumentCardContainer document={document}>
      <DocumentCardLayout
        document={document}
        onDelete={handleArchive}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        onEmailDocument={onEmailDocument}
        onToggleFavorite={handleToggleBookmark}
        onShareDocument={onShareDocument}
        onEditDocument={handleEditDocument}
        disableSelection={disableSelection}
        isArchiveView={isArchiveView}
      />
    </DocumentCardContainer>
  );
};

export default DocumentCard;
