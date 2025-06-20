
import React, { useState, useEffect, useCallback } from 'react';
import GlassCard from '@/components/ui-custom/GlassCard';
import { Document } from '@/utils/types';
import { DocumentSelectionProvider } from '@/components/documents/context/DocumentSelectionContext';
import { toast } from 'sonner';
import { usePetDocuments } from './hooks/usePetDocuments';
import PetDocumentsList from './document-tab/PetDocumentsList';
import PetDocumentDialogs from './document-tab/PetDocumentDialogs';

interface DocumentsTabProps {
  petId: string;
  petName: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ petId, petName }) => {
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isEmailDocumentOpen, setIsEmailDocumentOpen] = useState(false);
  const [isShareDocumentOpen, setIsShareDocumentOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const {
    documents,
    isLoading,
    handleDocumentChange,
    handleToggleFavorite,
    refreshPetDocuments,
    refetch
  } = usePetDocuments(petId, refreshTrigger);

  // Force immediate refresh when component mounts - but only once
  useEffect(() => {
    let isMounted = true;
    const forceInitialRefresh = async () => {
      if (isMounted) {
        await refreshPetDocuments();
        console.log(`[PetDocuments] Initial refresh completed for pet ${petId}, found ${documents?.length || 0} documents`);
      }
    };
    
    forceInitialRefresh();
    
    return () => {
      isMounted = false;
    };
  }, [petId]); // Remove refreshPetDocuments from dependencies to prevent re-runs

  const handleAddDocument = useCallback(async () => {
    console.log('Document added, triggering refresh');
    
    try {
      // Single refresh attempt with a success message
      await handleDocumentChange();
      
      // Update the UI trigger after a short delay
      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 500);
      
      toast.success(`Document has been uploaded for ${petName}`);
    } catch (error) {
      console.error('[PetDocuments] Error during document refresh:', error);
      toast.error('Error refreshing documents. Try refreshing the page.');
    } finally {
      setIsAddDocumentOpen(false);
    }
  }, [handleDocumentChange, petName]);

  const handleDeleteDocument = async (docId: string) => {
    await handleDocumentChange();
    // Trigger immediate UI refresh
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEmailDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsEmailDocumentOpen(true);
  };

  const handleShareDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsShareDocumentOpen(true);
  };

  return (
    <DocumentSelectionProvider>
      <GlassCard>
        <h2 className="text-xl font-semibold mb-4">Documents</h2>
        
        <PetDocumentsList
          documents={documents}
          isLoading={isLoading}
          onDeleteDocument={handleDeleteDocument}
          onEmailDocument={handleEmailDocument}
          onShareDocument={handleShareDocument}
          onToggleFavorite={handleToggleFavorite}
          onAddDocument={() => setIsAddDocumentOpen(true)}
          onRefreshDocuments={refreshPetDocuments}
          petName={petName}
        />
      </GlassCard>

      <PetDocumentDialogs
        isAddDocumentOpen={isAddDocumentOpen}
        isEmailDocumentOpen={isEmailDocumentOpen}
        isShareDocumentOpen={isShareDocumentOpen}
        isEditDocumentOpen={false}
        setIsAddDocumentOpen={setIsAddDocumentOpen}
        setIsEmailDocumentOpen={setIsEmailDocumentOpen}
        setIsShareDocumentOpen={setIsShareDocumentOpen}
        selectedDocument={selectedDocument}
        petId={petId}
        onDocumentAdded={handleAddDocument}
      />
    </DocumentSelectionProvider>
  );
};

export default DocumentsTab;
