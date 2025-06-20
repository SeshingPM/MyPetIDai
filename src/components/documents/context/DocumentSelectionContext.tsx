
import React, { createContext, useContext, useState } from 'react';
import { Document } from '@/utils/types';

interface DocumentSelectionContextType {
  selectedDocuments: Document[];
  toggleDocumentSelection: (document: Document) => void;
  isDocumentSelected: (document: Document) => boolean;
  clearSelection: () => void;
}

const DocumentSelectionContext = createContext<DocumentSelectionContextType | undefined>(undefined);

export const useDocumentSelection = () => {
  const context = useContext(DocumentSelectionContext);
  if (!context) {
    throw new Error('useDocumentSelection must be used within a DocumentSelectionProvider');
  }
  return context;
};

interface DocumentSelectionProviderProps {
  children: React.ReactNode;
}

export const DocumentSelectionProvider: React.FC<DocumentSelectionProviderProps> = ({ children }) => {
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);

  const toggleDocumentSelection = (document: Document) => {
    setSelectedDocuments(prev => {
      if (prev.find(d => d.id === document.id)) {
        return prev.filter(d => d.id !== document.id);
      } else {
        return [...prev, document];
      }
    });
  };

  const isDocumentSelected = (document: Document) => {
    return !!selectedDocuments.find(d => d.id === document.id);
  };

  const clearSelection = () => {
    setSelectedDocuments([]);
  };

  return (
    <DocumentSelectionContext.Provider value={{
      selectedDocuments,
      toggleDocumentSelection,
      isDocumentSelected,
      clearSelection
    }}>
      {children}
    </DocumentSelectionContext.Provider>
  );
};
