import React from "react";
import { Document } from "@/utils/types";
import DocumentCard from "@/components/documents/DocumentCard";
import DocumentGrid from "@/components/documents/list/DocumentGrid";

interface DocumentsGridListProps {
  documents: Document[];
  onDocumentDeleted: () => void;
  onDocumentRestored?: () => void;
  onToggleBookmark?: (document: Document) => void;
  onToggleFavorite?: (document: Document) => void;
  onEmailDocument?: (document: Document) => void;
  onShareDocument?: (document: Document) => void;
  onEditDocument?: (document: Document) => void;
  isArchiveView?: boolean;
  disableSelection?: boolean;
}

/**
 * Renders a grid of document cards
 */
const DocumentsGridList: React.FC<DocumentsGridListProps> = ({
  documents,
  onDocumentDeleted,
  onDocumentRestored,
  onToggleBookmark,
  onToggleFavorite,
  onEmailDocument,
  onShareDocument,
  onEditDocument,
  isArchiveView = false,
  disableSelection = false,
}) => {
  const bookmarkHandler = onToggleBookmark || onToggleFavorite;

  return (
    <DocumentGrid>
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onDelete={onDocumentDeleted}
          onRestore={isArchiveView ? onDocumentRestored : undefined}
          onPermanentDelete={isArchiveView ? onDocumentDeleted : undefined}
          onToggleBookmark={
            bookmarkHandler ? () => bookmarkHandler(document) : undefined
          }
          onEmailDocument={
            onEmailDocument ? () => onEmailDocument(document) : undefined
          }
          onShareDocument={
            onShareDocument ? () => onShareDocument(document) : undefined
          }
          onEditDocument={
            onEditDocument ? () => onEditDocument(document) : undefined
          }
          disableSelection={disableSelection}
          isArchiveView={isArchiveView}
        />
      ))}
    </DocumentGrid>
  );
};

export default DocumentsGridList;
