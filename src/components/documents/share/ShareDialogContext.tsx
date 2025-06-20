
import React, { createContext, useContext, memo } from 'react';
import { Document } from '@/utils/types';
import { useShareDialogState } from './hooks/useShareDialogState';

interface ShareDialogContextType {
  document: Document | null;
  shareLink: string;
  setShareLink: (link: string) => void;
  expiryHours: number;
  setExpiryHours: (hours: number) => void;
  hasLink: boolean;
  setHasLink: (hasLink: boolean) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  isRemoving: boolean;
  setIsRemoving: (isRemoving: boolean) => void;
  loadingInitial: boolean;
  setLoadingInitial: (loading: boolean) => void;
}

const ShareDialogContext = createContext<ShareDialogContextType | undefined>(undefined);

export const useShareDialog = () => {
  const context = useContext(ShareDialogContext);
  if (context === undefined) {
    throw new Error('useShareDialog must be used within a ShareDialogProvider');
  }
  return context;
};

interface ShareDialogProviderProps {
  children: React.ReactNode;
  document: Document | null;
  open: boolean;
}

// Memoize the provider to prevent unnecessary re-renders
export const ShareDialogProvider: React.FC<ShareDialogProviderProps> = memo(({ 
  children, 
  document,
  open
}) => {
  // Use our custom hook to manage the share dialog state
  const shareDialogState = useShareDialogState(document, open);

  return (
    <ShareDialogContext.Provider value={shareDialogState}>
      {children}
    </ShareDialogContext.Provider>
  );
});

ShareDialogProvider.displayName = 'ShareDialogProvider';
