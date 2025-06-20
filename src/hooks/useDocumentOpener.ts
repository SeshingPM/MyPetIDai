
import { toast } from "sonner";
import { Document as DocumentType } from "@/utils/types";
import { useState, useCallback } from "react";

/**
 * Custom hook for handling document opening functionality
 */
export const useDocumentOpener = () => {
  const [isOpening, setIsOpening] = useState(false);

  /**
   * Get appropriate fallback URL based on document type
   */
  const getFallbackUrl = useCallback((doc: DocumentType): string => {
    const fakePdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    const fakeImageUrl = 'https://placehold.co/600x400/png';
    
    if (doc.fileType?.includes('pdf')) {
      return fakePdfUrl;
    } else if (doc.fileType?.includes('image')) {
      return fakeImageUrl;
    } else {
      return fakePdfUrl;
    }
  }, []);

  /**
   * Get the appropriate URL to open for a document
   */
  const getDocumentUrl = useCallback((doc: DocumentType): string => {
    // Use the document's URL if it exists and is valid
    if (doc.fileUrl && !doc.fileUrl.includes('#')) {
      return doc.fileUrl;
    }
    
    // Otherwise use an appropriate fallback
    return getFallbackUrl(doc);
  }, [getFallbackUrl]);

  /**
   * Open a URL in a new tab/window
   */
  const openUrlInNewTab = useCallback((url: string): boolean => {
    try {
      const newWindow = window.open(url, '_blank');
      
      // If window.open was blocked, return false to trigger fallback
      if (!newWindow) {
        console.warn('Popup was blocked, falling back to alternative method');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error opening URL in new tab:', error);
      return false;
    }
  }, []);

  /**
   * Fallback method to open URL when window.open is blocked
   */
  const openUrlWithFallback = useCallback((url: string): void => {
    try {
      const link = window.document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (error) {
      console.error('Error in fallback open method:', error);
      toast.error('Could not open the document. Please check your browser settings.');
    }
  }, []);

  /**
   * Handle error when opening document fails
   */
  const handleOpenError = useCallback((doc: DocumentType, error: unknown) => {
    console.error('Error opening document:', error);
    toast.error('Could not open the document. Using fallback preview.');
    
    // Use timeout for fallback
    setTimeout(() => {
      openUrlInNewTab(getFallbackUrl(doc));
    }, 50);
  }, [getFallbackUrl, openUrlInNewTab]);

  /**
   * Main function to open a document
   */
  const openDocument = useCallback((doc: DocumentType) => {
    // Prevent multiple rapid clicks
    if (isOpening) return;
    
    setIsOpening(true);
    
    try {
      // Get the appropriate URL for this document
      const url = getDocumentUrl(doc);
      
      // Use timeout to prevent UI freezing and ensure state updates
      setTimeout(() => {
        try {
          // Try primary method first
          const success = openUrlInNewTab(url);
          
          // If primary method failed, use fallback
          if (!success) {
            openUrlWithFallback(url);
          }
        } catch (innerError) {
          handleOpenError(doc, innerError);
        } finally {
          // Reset opening state regardless of outcome
          setIsOpening(false);
        }
      }, 50);
    } catch (error) {
      handleOpenError(doc, error);
      
      // Reset state if error occurs
      setIsOpening(false);
    }
  }, [isOpening, getDocumentUrl, openUrlInNewTab, openUrlWithFallback, handleOpenError]);

  return { openDocument, isOpening };
};
