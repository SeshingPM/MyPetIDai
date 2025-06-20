import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FadeIn from '@/components/animations/FadeIn';
import { Document } from '@/utils/types';
import DocumentCard from '@/components/documents/DocumentCard';
import DocumentsSectionHeader from './documents/DocumentsSectionHeader';
import DocumentsEmptyState from './documents/DocumentsEmptyState';
import { useDocuments } from '@/contexts/DocumentsContext';
import { useQueryClient } from '@tanstack/react-query';

interface DocumentsSectionProps {
  onEmailDocument?: (document: Document) => void;
  onShareDocument?: (document: Document) => void;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  onEmailDocument,
  onShareDocument
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { documents, isLoading, error } = useDocuments();

  const handleViewAllDocuments = () => {
    navigate('/documents');
  };

  const handleAddDocument = () => {
    navigate('/documents');
  };
  
  // Add a proper edit document handler
  const handleEditDocument = useCallback((document: Document) => {
    console.log('Overview tab: Edit document triggered for:', document.id);
    // The actual edit functionality will be handled by the EditDocumentMenuItem
    // inside the ActionMenu within DocumentCard
  }, []);

  return (
    <FadeIn delay={400}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DocumentsSectionHeader
          onViewAll={handleViewAllDocuments}
        />
        
        <div className="p-5">
          {isLoading ? (
            <div className="py-4 text-center text-gray-500">
              <p>Loading documents...</p>
            </div>
          ) : error ? (
            <div className="py-4 text-center text-red-500">
              <p>Error loading documents. Please try again.</p>
            </div>
          ) : documents.length > 0 ? (
            <div className="space-y-3">
              {documents.slice(0, 3).map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  disableSelection={true}
                  onEmailDocument={onEmailDocument ? () => onEmailDocument(doc) : undefined}
                  onShareDocument={onShareDocument ? () => onShareDocument(doc) : undefined}
                  onEditDocument={(document) => {
                    console.log('Overview tab DocumentCard edit clicked:', document.id);
                    handleEditDocument(document);
                    // The actual edit will be handled by EditDocumentMenuItem
                  }}
                />
              ))}
            </div>
          ) : (
            <DocumentsEmptyState onAddDocument={handleAddDocument} />
          )}
        </div>
      </div>
    </FadeIn>
  );
};

export default DocumentsSection;
