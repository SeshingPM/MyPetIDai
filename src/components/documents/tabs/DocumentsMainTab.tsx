
import React, { useEffect, useState } from 'react';
import { Document } from '@/utils/types';
import DocumentsGridList from '../list/DocumentsGridList';
import DocumentsEmptyState from '../DocumentsEmptyState';
import DocumentsLoadingState from '../DocumentsLoadingState';
import DocumentsErrorState from '../DocumentsErrorState';
import { usePets } from '@/contexts/pets';

interface DocumentsMainTabProps {
  documents: Document[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
  onAddDocument: () => void;
  onEmailDocument: (document: Document) => void;
  onShareDocument: (document: Document) => void;
  onToggleFavorite?: (document: Document) => void;
  isArchiveView?: boolean;
}

const DocumentsMainTab: React.FC<DocumentsMainTabProps> = ({
  documents,
  isLoading,
  error,
  onRefresh,
  onAddDocument,
  onEmailDocument,
  onShareDocument,
  onToggleFavorite,
  isArchiveView = false
}) => {
  // Fetch pets to display pet names
  const { pets } = usePets();
  const [documentsWithPetNames, setDocumentsWithPetNames] = useState<Document[]>([]);
  
  // Enhance documents with pet names
  useEffect(() => {
    if (documents && pets) {
      const enhanced = documents.map(doc => {
        if (doc.petId) {
          const associatedPet = pets.find(pet => pet.id === doc.petId);
          return {
            ...doc,
            petName: associatedPet ? associatedPet.name : undefined
          };
        }
        return doc;
      });
      setDocumentsWithPetNames(enhanced);
    } else {
      setDocumentsWithPetNames(documents || []);
    }
  }, [documents, pets]);

  if (isLoading) {
    return <DocumentsLoadingState />;
  }

  if (error) {
    return <DocumentsErrorState error={error} onRetry={onRefresh} />;
  }

  if (!documentsWithPetNames || documentsWithPetNames.length === 0) {
    return <DocumentsEmptyState onAddDocument={onAddDocument} />;
  }

  return (
    <DocumentsGridList
      documents={documentsWithPetNames}
      onDocumentDeleted={onRefresh}
      onEmailDocument={onEmailDocument}
      onShareDocument={onShareDocument}
      onToggleFavorite={onToggleFavorite}
      isArchiveView={isArchiveView}
    />
  );
};

export default DocumentsMainTab;
