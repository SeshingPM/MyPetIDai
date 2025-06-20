
import React, { useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Document } from '@/utils/types';
import { ShareDialogProvider } from './ShareDialogContext';
import ShareDialogContent from './ShareDialogContent';
import NoDocumentState from './NoDocumentState';
import ErrorBoundary from '@/components/ui-custom/ErrorBoundary';

interface ShareDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
}

const ShareDocumentDialog: React.FC<ShareDocumentDialogProps> = ({ 
  open, 
  onOpenChange,
  document
}) => {
  const handleDialogChange = useCallback((newOpen: boolean) => {
    // If we're closing the dialog, wait a short time to allow any pending
    // operations to complete before actually closing
    if (!newOpen && open) {
      setTimeout(() => {
        onOpenChange(false);
      }, 100);
    } else {
      onOpenChange(newOpen);
    }
  }, [open, onOpenChange]);

  if (!document && open) {
    return <NoDocumentState open={open} onOpenChange={onOpenChange} />;
  }

  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }) => (
        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Error Sharing Document</DialogTitle>
              <DialogDescription>
                {error.message || "An unexpected error occurred. Please try again later."}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex justify-end">
              <button
                onClick={resetErrorBoundary}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    >
      <ShareDialogProvider document={document} open={open}>
        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Document</DialogTitle>
              <DialogDescription>
                {document?.shareUrl 
                  ? 'Your document is available via the link below' 
                  : 'Generate a temporary link to share this document'}
              </DialogDescription>
            </DialogHeader>
            
            <ShareDialogContent onOpenChange={handleDialogChange} />
          </DialogContent>
        </Dialog>
      </ShareDialogProvider>
    </ErrorBoundary>
  );
};

export default React.memo(ShareDocumentDialog);
