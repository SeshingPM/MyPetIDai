import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import FileUploadSection from '../FileUploadSection';
import DocumentMetadataForm from './DocumentMetadataForm';
import { useDocumentUpload } from './hooks/useDocumentUpload';
import { useDocumentForm } from './hooks/useDocumentForm';
import DocumentFormActions from './DocumentFormActions';
import logger from '@/utils/logger';

interface DocumentFormContainerProps {
  petId?: string;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

const DocumentFormContainer: React.FC<DocumentFormContainerProps> = ({
  petId,
  isUploading,
  setIsUploading,
  onSuccess,
  onCancel
}) => {
  const { uploadDocument } = useDocumentUpload();
  const queryClient = useQueryClient();
  
  // Use state to track the selected pet ID (initialize from props if provided)
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(petId);

  const {
    file,
    setFile,
    documentName,
    setDocumentName,
    category,
    setCategory,
    uploadError,
    handleFileChange,
    isFormValid
  } = useDocumentForm({
    petId,
    setIsUploading,
    onSuccess
  });

  // Track component lifecycle for debugging
  useEffect(() => {
    logger.debug('[DocumentForm] Form container mounted', { petId });
    
    return () => {
      logger.debug('[DocumentForm] Form container unmounted');
    };
  }, [petId]);
  


const handleSubmit = async (e: React.FormEvent) => {
    // Ensure we prevent default form submission behavior
    e.preventDefault();
    e.stopPropagation();
    
    logger.info('[DocumentForm] Form submission initiated');
    
    if (!file || !documentName || !category) {
      toast.error("Please fill in all the fields and select a file.");
      return;
    }
    
    if (isUploading) {
      // Prevent multiple submissions
      logger.warn('[DocumentForm] Submission attempted while already uploading');
      return;
    }
    
    // Double-check file validity before proceeding
    if (!file || file.size === 0) {
      toast.error("The selected file appears to be empty. Please try selecting it again.");
      logger.error('[DocumentForm] File validation failed: empty file');
      return;
    }
    
    // Log file details for debugging
    logger.info(`[DocumentForm] Preparing to upload file: ${file.name} (${file.type}, ${file.size} bytes)`);
    
    setIsUploading(true);
    
    try {
      // Show immediate upload started feedback
      toast.loading("Uploading document...", { id: "document-upload" });
      
      // Pre-invalidate queries to ensure fresh data after upload
      queryClient.invalidateQueries({
        queryKey: ['documents'],
        exact: false
      });
      
      logger.debug(`[DocumentForm] Starting upload for "${documentName}" (${category})`);
      
      // Create a file clone to ensure it's properly detached from the input
      // This helps with Android browser inconsistencies
      let fileToUpload: File;
      
      try {
        // For Android, use a more reliable cloning method
        const userAgent = navigator.userAgent.toLowerCase();
        const isAndroidDevice = /android/i.test(userAgent);
        
        if (isAndroidDevice) {
          // On Android, read as array buffer first for more reliable cloning
          const arrayBuffer = await file.arrayBuffer();
          fileToUpload = new File([arrayBuffer], file.name, { type: file.type });
          
          // Verify the clone worked properly
          if (fileToUpload.size === 0 && file.size > 0) {
            logger.warn('[DocumentForm] Android file clone has zero size, using original file');
            fileToUpload = file;
          } else {
            logger.info(`[DocumentForm] Android file cloned successfully: ${fileToUpload.size} bytes`);
          }
        } else {
          // Standard cloning for other platforms
          const fileClone = new File([file], file.name, { type: file.type });
          
          // Verify the clone worked properly
          if (fileClone.size === 0 && file.size > 0) {
            logger.warn('[DocumentForm] File clone has zero size, using original file');
            fileToUpload = file;
          } else {
            fileToUpload = fileClone;
          }
        }
      } catch (cloneError) {
        logger.error('[DocumentForm] Error cloning file:', cloneError);
        fileToUpload = file; // Fall back to original file
      }
      
      // Final verification before upload
      if (!fileToUpload || fileToUpload.size === 0) {
        throw new Error("File processing failed. Please try selecting it again.");
      }
      
      logger.info(`[DocumentForm] Uploading file: ${fileToUpload.name} (${fileToUpload.size} bytes)`);
      
      try {
        const result = await uploadDocument({
          file: fileToUpload,
          documentName,
          category,
          petId: selectedPetId  // Use the tracked selectedPetId instead of prop
        });
        
        // Dismiss loading toast and show success
        toast.dismiss("document-upload");
        
        if (result) {
          logger.info(`[DocumentForm] Document uploaded successfully with ID: ${result.id}`);
          toast.success("Document uploaded successfully");
          
          // Reset form fields
          setFile(null);
          setDocumentName('');
          setCategory('');
          
          // Use a small delay before calling onSuccess for better UX
          setTimeout(() => {
            logger.debug('[DocumentForm] Calling onSuccess callback');
            onSuccess();
          }, 300);
        }
      } catch (uploadError: any) {
        // Dismiss loading toast and show detailed error
        toast.dismiss("document-upload");
        
        // Provide more specific error messages based on the error type
        let errorMessage = "There was a problem uploading your document. Please try again.";
        
        if (uploadError?.message?.includes('authentication')) {
          errorMessage = "Your session has expired. Please log in again to upload documents.";
        } else if (uploadError?.message?.includes('network')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (uploadError?.message?.includes('storage quota')) {
          errorMessage = "Storage quota exceeded. Please contact support.";
        } else if (uploadError?.message?.includes('file type')) {
          errorMessage = "This file type is not supported. Please try a different file.";
        }
        
        logger.error(`[DocumentForm] Error uploading document:`, uploadError);
        toast.error(errorMessage);
        
        // Ensure we reset the uploading state
        setIsUploading(false);
      }
    } catch (error) {
      // Dismiss loading toast and show error for any other errors
      toast.dismiss("document-upload");
      logger.error(`[DocumentForm] Unexpected error in form submission:`, error);
      toast.error("There was a problem with your request. Please try again.");
      setIsUploading(false);
    }
  };

  




  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4"
    >
      <DocumentMetadataForm 
        documentName={documentName}
        setDocumentName={setDocumentName}
        category={category}
        setCategory={setCategory}
        isUploading={isUploading}
        file={file}
        petId={selectedPetId}
        onPetChange={setSelectedPetId}
      />
      
      <FileUploadSection 
        file={file}
        setFile={setFile}
        handleFileChange={handleFileChange}
        isUploading={isUploading}
      />
      
      {uploadError && (
        <div className="text-sm text-red-500">
          Error: {uploadError}
        </div>
      )}
      
      <DocumentFormActions 
        isUploading={isUploading}
        isFormValid={isFormValid}
        onCancel={onCancel}
      />
    </form>
  );
};

export default DocumentFormContainer;
