
import React from 'react';
import { Document } from '@/utils/types';
import { Card } from '@/components/ui/card';
import { useDocumentLoader } from '@/hooks/useDocumentLoader';
import LoadingState from '@/components/shared-document/LoadingState';
import DocumentContent from '@/components/shared-document/DocumentContent';

interface DocumentViewerProps {
  documentId?: string;
  shareId?: string;
  document?: Document;
  showHeader?: boolean;
  className?: string;
}

/**
 * A reusable document viewer component that can display a document
 * from various sources (direct document object, shareId, or documentId)
 */
const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentId,
  shareId,
  document: externalDocument,
  showHeader = true,
  className = ''
}) => {
  const { 
    document: loadedDocument, 
    loading, 
    error 
  } = useDocumentLoader({ 
    shareId, 
    skipLoading: !!externalDocument 
  });

  // Use the external document if provided, otherwise use the loaded document
  const document = externalDocument || loadedDocument;

  if (loading) {
    return <LoadingState />;
  }

  if (error || !document) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <p className="text-red-500">
          {error || "Unable to load document"}
        </p>
      </Card>
    );
  }

  return <DocumentContent document={document} />;
};

export default DocumentViewer;
