import React from "react";
import { Document } from "@/utils/types";
import DocumentActions from "./DocumentActions";
import ViewDocumentButton from "./ViewDocumentButton";

interface DocumentCardActionsWrapperProps {
  document: Document;
  onDelete?: () => void;
  onRestore?: () => void;
  onPermanentDelete?: () => void;
  onEmailDocument?: () => void;
  onToggleBookmark?: () => void;
  onToggleFavorite?: () => void;
  onShareDocument?: () => void;
  onEditDocument?: (document: Document) => void;
  isArchiveView?: boolean;
}

const DocumentCardActionsWrapper: React.FC<DocumentCardActionsWrapperProps> = ({
  document,
  onDelete,
  onRestore,
  onPermanentDelete,
  onEmailDocument,
  onToggleBookmark,
  onToggleFavorite,
  onShareDocument,
  onEditDocument,
  isArchiveView = false,
}) => {
  const handleToggleBookmark = onToggleBookmark || onToggleFavorite;

  return (
    <div
      className="flex items-center gap-1 mt-2 sm:mt-0 sm:ml-auto action-buttons"
      onClick={(e) => e.stopPropagation()}
    >
      <ViewDocumentButton document={document} />
      <DocumentActions
        document={document}
        onDelete={onDelete}
        onRestore={onRestore}
        onPermanentDelete={onPermanentDelete}
        onEmailDocument={onEmailDocument}
        onToggleBookmark={handleToggleBookmark}
        onShareDocument={onShareDocument}
        onEditDocument={onEditDocument}
        isArchiveView={isArchiveView}
      />
    </div>
  );
};

export default DocumentCardActionsWrapper;
