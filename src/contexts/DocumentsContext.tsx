import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Document } from '@/utils/types';
import { fetchAllDocuments } from '@/utils/document-api/fetch/fetchAllDocuments';
import { fetchPetDocuments } from '@/utils/document-api/fetch/fetchPetDocuments';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentsContextType {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'userId'>) => Promise<string | null>;
  deleteDocument: (id: string) => Promise<boolean>;
  bulkDeleteDocuments: (ids: string[]) => Promise<boolean>;
  shareDocument: (id: string) => Promise<string | null>;
  refreshDocuments: () => Promise<void>;
  getDocumentsForPet: (petId: string) => Document[];
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export const useDocuments = () => {
  const context = useContext(DocumentsContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentsProvider');
  }
  return context;
};

export const DocumentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Fetch documents function that can be called to refresh data
  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the actual API function to fetch documents
      const fetchedDocuments = await fetchAllDocuments(false);
      setDocuments(fetchedDocuments);
      
      console.log(`[DocumentsContext] Fetched ${fetchedDocuments.length} documents`);
    } catch (err) {
      console.error("[DocumentsContext] Error fetching documents:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
      toast.error('Failed to load documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch documents on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      // Clear documents when user is not authenticated
      setDocuments([]);
      setIsLoading(false);
    }
  }, [user, fetchDocuments]);

  // Function to get documents for a specific pet
  const getDocumentsForPet = useCallback((petId: string): Document[] => {
    return documents.filter(doc => doc.petId === petId);
  }, [documents]);

  const addDocument = async (document: Omit<Document, 'id' | 'createdAt' | 'userId'>): Promise<string | null> => {
    try {
      // This would be replaced with actual API call to add document
      // For now, we'll just add it to the local state and refresh
      const newDocument: Document = {
        ...document,
        id: Math.random().toString(36).substring(2, 9),
        userId: user?.id || 'unknown',
        createdAt: new Date().toISOString(),
        fileType: document.fileType || 'application/pdf',
      };
      
      setDocuments(prev => [...prev, newDocument]);
      toast.success('Document added successfully');
      
      // Refresh documents to get the latest data
      await fetchDocuments();
      
      return newDocument.id;
    } catch (err) {
      console.error("[DocumentsContext] Error adding document:", err);
      toast.error('Failed to add document. Please try again.');
      return null;
    }
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      // This would be replaced with actual API call to delete document
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      toast.success('Document deleted successfully');
      
      // Refresh documents to get the latest data
      await fetchDocuments();
      
      return true;
    } catch (err) {
      console.error("[DocumentsContext] Error deleting document:", err);
      toast.error('Failed to delete document. Please try again.');
      return false;
    }
  };

  const bulkDeleteDocuments = async (ids: string[]): Promise<boolean> => {
    try {
      // This would be replaced with actual API call to bulk delete documents
      setDocuments(prev => prev.filter(doc => !ids.includes(doc.id)));
      toast.success(`${ids.length} documents deleted successfully`);
      
      // Refresh documents to get the latest data
      await fetchDocuments();
      
      return true;
    } catch (err) {
      console.error("[DocumentsContext] Error deleting documents:", err);
      toast.error('Failed to delete documents. Please try again.');
      return false;
    }
  };

  const shareDocument = async (id: string): Promise<string | null> => {
    try {
      // This would be replaced with actual API call to share document
      const shareId = Math.random().toString(36).substring(2, 15);
      toast.success('Document shared successfully');
      return shareId;
    } catch (err) {
      console.error("[DocumentsContext] Error sharing document:", err);
      toast.error('Failed to share document. Please try again.');
      return null;
    }
  };

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        isLoading,
        error,
        addDocument,
        deleteDocument,
        bulkDeleteDocuments,
        shareDocument,
        refreshDocuments: fetchDocuments,
        getDocumentsForPet
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
};
