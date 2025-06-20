
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Link2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { addDays } from 'date-fns';
import { useShareDialog } from './ShareDialogContext';
import { generateShareLink } from '@/utils/document-sharing';
import ShareLinkExpiry from './ShareLinkExpiry';

const GenerateShareLink: React.FC = () => {
  const { 
    document, 
    expiryHours, 
    setExpiryHours, 
    setShareLink, 
    setHasLink, 
    isGenerating, 
    setIsGenerating 
  } = useShareDialog();

  const handleGenerateLink = useCallback(async () => {
    if (!document) {
      toast.error('No document selected');
      return;
    }

    setIsGenerating(true);
    
    try {
      const updatedDoc = await generateShareLink(document.id, expiryHours);
      
      if (updatedDoc && updatedDoc.shareUrl) {
        setShareLink(updatedDoc.shareUrl);
        setHasLink(true);
        toast.success(`Link generated! Valid for ${expiryHours} hours`);
      } else {
        // Handle case where we got no document back
        toast.error('Failed to generate share link. Please try again.');
      }
    } catch (error) {
      console.error('Error in handleGenerateLink:', error);
      toast.error('Failed to generate share link. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [document, expiryHours, setShareLink, setHasLink, setIsGenerating]);

  // Calculate future expiry date based on current hours setting
  const expiryDate = addDays(new Date(), expiryHours / 24);

  return (
    <>
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium">Link expiry time (hours)</label>
          <span className="text-sm text-muted-foreground">{expiryHours} hours</span>
        </div>
        <Slider
          value={[expiryHours]}
          onValueChange={(values) => setExpiryHours(values[0])}
          min={1}
          max={168}
          step={1}
        />
        <ShareLinkExpiry 
          expiryDate={expiryDate} 
          prefix="Link expires on"
          className="text-sm text-muted-foreground mt-1"
        />
      </div>
      
      <Button 
        onClick={handleGenerateLink}
        disabled={isGenerating}
        className="w-full mt-4"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Link2 className="mr-2 h-4 w-4" />
            Generate Share Link
          </>
        )}
      </Button>
    </>
  );
};

export default React.memo(GenerateShareLink);
