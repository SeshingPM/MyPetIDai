import React from "react";
import { Document } from "@/utils/types";
import DocumentSelectionWrapper from "./DocumentSelectionWrapper";
import DocumentIcon from "./DocumentIcon";
import DocumentCardContent from "./DocumentCardContent";
import DocumentCardActionsWrapper from "./DocumentCardActionsWrapper";

interface DocumentCardLayoutProps {
  document: Document;
  onDelete?: () => void;
  onRestore?: () => void;
  onPermanentDelete?: () => void;
  onEmailDocument?: () => void;
  onToggleBookmark?: () => void;
  onToggleFavorite?: () => void;
  onShareDocument?: () => void;
  onEditDocument?: (document: Document) => void;
  disableSelection: boolean;
  isArchiveView: boolean;
}

const DocumentCardLayout: React.FC<DocumentCardLayoutProps> = ({
  document,
  onDelete,
  onRestore,
  onPermanentDelete,
  onEmailDocument,
  onToggleBookmark,
  onToggleFavorite,
  onShareDocument,
  onEditDocument,
  disableSelection,
  isArchiveView,
}) => {
  const handleToggleBookmark = onToggleBookmark || onToggleFavorite;

  return (
    <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-start gap-3 relative">
      <div className="flex items-start gap-3 w-full min-w-0">
        <DocumentSelectionWrapper
          document={document}
          disableSelection={disableSelection}
        />

        <div className="flex-shrink-0 mt-1">
          <DocumentIcon
            fileType={document.fileType}
            category={document.category}
          />
        </div>

        <DocumentCardContent
          document={document}
          isArchiveView={isArchiveView}
        />
      </div>

      <DocumentCardActionsWrapper
        document={document}
        onDelete={isArchiveView ? onPermanentDelete : onDelete}
        onRestore={isArchiveView ? onRestore : undefined}
        onPermanentDelete={onPermanentDelete}
        onEmailDocument={onEmailDocument}
        onToggleFavorite={handleToggleBookmark}
        onShareDocument={onShareDocument}
        onEditDocument={(doc) => {
          console.log(
            "DocumentCardLayout received edit request for document:",
            doc
          );
          if (onEditDocument) {
            onEditDocument(doc);
          }
        }}
        isArchiveView={isArchiveView}
      />
    </div>
  );
};

export default DocumentCardLayout;
