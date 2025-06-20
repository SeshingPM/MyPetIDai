
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useShareDialog } from './ShareDialogContext';
import { removeShareLink } from '@/utils/document-sharing';
import ShareLinkExpiry from './ShareLinkExpiry';

const ExistingShareLink: React.FC = () => {
  const { 
    document, 
    shareLink, 
    setShareLink, 
    setHasLink, 
    isRemoving, 
    setIsRemoving 
  } = useShareDialog();

  const handleCopyLink = useCallback(() => {
    if (!shareLink) {
      toast.error('No link to copy');
      return;
    }
    
    try {
      navigator.clipboard.writeText(shareLink);
      toast.success('Share link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link to clipboard');
    }
  }, [shareLink]);

  const handleRemoveLink = useCallback(async () => {
    if (!document) {
      toast.error('No document selected');
      return;
    }

    if (isRemoving) return; // Prevent multiple clicks
    setIsRemoving(true);
    
    try {
      const success = await removeShareLink(document.id);
      
      if (success) {
        setShareLink('');
        setHasLink(false);
        toast.success('Share link removed');
      } else {
        toast.error('Failed to remove share link. Please try again.');
      }
    } catch (error) {
      console.error('Error in handleRemoveLink:', error);
      toast.error('Failed to remove share link. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  }, [document, isRemoving, setIsRemoving, setShareLink, setHasLink]);

  return (
    <>
      <div className="flex items-center space-x-2">
        <Input 
          value={shareLink} 
          readOnly 
          className="flex-1"
          aria-label="Share URL"
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleCopyLink}
          aria-label="Copy link"
          type="button"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      
      {document?.shareExpiry && (
        <ShareLinkExpiry expiryDate={document.shareExpiry} />
      )}
      
      <Button 
        variant="destructive" 
        onClick={handleRemoveLink}
        disabled={isRemoving}
        className="w-full mt-4"
        type="button"
      >
        {isRemoving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Removing...
          </>
        ) : 'Remove Share Link'}
      </Button>
    </>
  );
};

export default React.memo(ExistingShareLink);
