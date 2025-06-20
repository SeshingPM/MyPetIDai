
import React from 'react';
import { Document } from '@/utils/types';
import { DocumentSelectionProvider } from '@/components/documents/context/DocumentSelectionContext';
import { PetsProvider } from '@/contexts/pets';

interface ListContextProviderProps {
  children: React.ReactNode;
}

/**
 * Provides the necessary context providers for document list functionality
 */
const ListContextProvider: React.FC<ListContextProviderProps> = ({ children }) => {
  return (
    <PetsProvider>
      <DocumentSelectionProvider>
        {children}
      </DocumentSelectionProvider>
    </PetsProvider>
  );
};

export default ListContextProvider;
