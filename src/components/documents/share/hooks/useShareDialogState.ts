
import { useState, useEffect, useRef, useCallback } from 'react';
import { Document } from '@/utils/types';
import { isShareLinkValid } from '@/utils/document-sharing';

export interface ShareDialogState {
  shareLink: string;
  expiryHours: number;
  hasLink: boolean;
  isGenerating: boolean;
  isRemoving: boolean;
  loadingInitial: boolean;
}

export interface ShareDialogActions {
  setShareLink: (link: string) => void;
  setExpiryHours: (hours: number) => void;
  setHasLink: (hasLink: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setIsRemoving: (isRemoving: boolean) => void;
  setLoadingInitial: (loading: boolean) => void;
}

/**
 * Custom hook for managing the share dialog state
 */
export const useShareDialogState = (document: Document | null, open: boolean) => {
  const [shareLink, setShareLink] = useState<string>('');
  const [expiryHours, setExpiryHours] = useState<number>(48);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [hasLink, setHasLink] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  // Refs to track previous values and prevent unnecessary effect runs
  const prevDocumentRef = useRef<Document | null>(null);
  const prevOpenRef = useRef<boolean>(false);
  const effectCleanedUpRef = useRef<boolean>(false);
  
  // Reset state and check for existing share link when dialog opens or document changes
  useEffect(() => {
    // Skip if dialog is closed or if we're reopening with the same document (no changes)
    if (!open) {
      effectCleanedUpRef.current = true;
      return;
    }
    
    // Skip if document and open state haven't changed
    if (
      prevDocumentRef.current === document && 
      prevOpenRef.current === open &&
      prevDocumentRef.current !== null
    ) {
      return;
    }
    
    // Update refs
    prevDocumentRef.current = document;
    prevOpenRef.current = open;
    effectCleanedUpRef.current = false;
    
    let isMounted = true;
    setLoadingInitial(true);
    
    if (!document) {
      if (isMounted) {
        setLoadingInitial(false);
        setShareLink('');
        setHasLink(false);
      }
      return;
    }
    
    // Use a timeout to prevent blocking the UI
    const timeoutId = setTimeout(() => {
      if (!isMounted || effectCleanedUpRef.current) return;
      
      try {
        // Check if document already has a valid share link
        const hasValidLink = isShareLinkValid(document);
        
        if (isMounted && !effectCleanedUpRef.current) {
          setHasLink(hasValidLink);
          
          if (hasValidLink && document.shareUrl) {
            setShareLink(document.shareUrl);
          } else {
            setShareLink('');
          }
        }
      } catch (error) {
        console.error('Error checking document share status:', error);
        if (isMounted && !effectCleanedUpRef.current) {
          setHasLink(false);
          setShareLink('');
        }
      } finally {
        if (isMounted && !effectCleanedUpRef.current) {
          setLoadingInitial(false);
        }
      }
    }, 0);
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
      effectCleanedUpRef.current = true;
      clearTimeout(timeoutId);
    };
  }, [document, open]);

  // Wrap state setters in useCallback to maintain reference stability
  const setShareLinkStable = useCallback((link: string) => {
    setShareLink(link);
  }, []);
  
  const setExpiryHoursStable = useCallback((hours: number) => {
    setExpiryHours(hours);
  }, []);
  
  const setHasLinkStable = useCallback((has: boolean) => {
    setHasLink(has);
  }, []);
  
  const setIsGeneratingStable = useCallback((generating: boolean) => {
    setIsGenerating(generating);
  }, []);
  
  const setIsRemovingStable = useCallback((removing: boolean) => {
    setIsRemoving(removing);
  }, []);
  
  const setLoadingInitialStable = useCallback((loading: boolean) => {
    setLoadingInitial(loading);
  }, []);

  return {
    // State
    document,
    shareLink,
    expiryHours,
    hasLink,
    isGenerating,
    isRemoving,
    loadingInitial,
    
    // Actions (with stable references)
    setShareLink: setShareLinkStable,
    setExpiryHours: setExpiryHoursStable,
    setHasLink: setHasLinkStable,
    setIsGenerating: setIsGeneratingStable,
    setIsRemoving: setIsRemovingStable,
    setLoadingInitial: setLoadingInitialStable,
  };
};
