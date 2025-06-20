
import React from 'react';
import { Document } from '@/utils/types';
import { PetsProvider } from '@/contexts/pets';
import DocumentsTabs from '@/components/documents/tabs/DocumentsTabs';
import ErrorBoundary from '@/components/ui-custom/ErrorBoundary';
import DocumentsErrorFallback from './DocumentsErrorFallback';

interface DocumentsTabsWrapperProps {
  documents: Document[] | undefined;
  isLoading: boolean;
  error: Error | unknown;
  onRefresh: () => void;
  onAddDocument: () => void;
  onEmailDocument: (document: Document) => void;
  onShareDocument: (document: Document) => void;
  onToggleFavorite?: (document: Document) => void;
  onEditDocument?: (document: Document) => void;
}

const DocumentsTabsWrapper: React.FC<DocumentsTabsWrapperProps> = ({
  documents,
  isLoading,
  error,
  onRefresh,
  onAddDocument,
  onEmailDocument,
  onShareDocument,
  onToggleFavorite,
  onEditDocument
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-6 mb-6">
      <PetsProvider>
        <ErrorBoundary 
          fallback={({ error, resetErrorBoundary }) => (
            <DocumentsErrorFallback onRefresh={() => {
              resetErrorBoundary();
              onRefresh();
            }} />
          )}
        >
          <DocumentsTabs
            documents={documents}
            isLoading={isLoading}
            error={error as Error}
            refetch={onRefresh}
            onAddDocument={onAddDocument}
            onEmailDocument={onEmailDocument}
            onShareDocument={onShareDocument}
            onToggleFavorite={onToggleFavorite}
            onEditDocument={onEditDocument}
          />
        </ErrorBoundary>
      </PetsProvider>
    </div>
  );
};

export default DocumentsTabsWrapper;
