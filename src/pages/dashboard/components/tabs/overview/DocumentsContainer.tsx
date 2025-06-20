
import React, { useState } from 'react';
import DocumentsSection from './DocumentsSection';
import EmailDocumentDialog from '@/components/documents/EmailDocumentDialog';
import ShareDocumentDialog from '@/components/documents/share/ShareDocumentDialog';
import { Document } from '@/utils/types';

/**
 * Container component that handles document dialogs
 */
const DocumentsContainer: React.FC = () => {
  const [isShareDocumentOpen, setIsShareDocumentOpen] = useState(false);
  const [isEmailDocumentOpen, setIsEmailDocumentOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleEmailDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsEmailDocumentOpen(true);
  };

  const handleShareDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsShareDocumentOpen(true);
  };

  return (
    <>
      <DocumentsSection 
        onEmailDocument={handleEmailDocument}
        onShareDocument={handleShareDocument}
      />

      <EmailDocumentDialog
        open={isEmailDocumentOpen}
        onOpenChange={setIsEmailDocumentOpen}
        document={selectedDocument}
      />

      <ShareDocumentDialog
        open={isShareDocumentOpen}
        onOpenChange={setIsShareDocumentOpen}
        document={selectedDocument}
      />
    </>
  );
};

export default DocumentsContainer;
