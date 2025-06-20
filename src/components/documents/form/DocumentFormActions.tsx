
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';

interface DocumentFormActionsProps {
  isUploading: boolean;
  isFormValid: boolean;
  onCancel: () => void;
}

const DocumentFormActions: React.FC<DocumentFormActionsProps> = ({
  isUploading,
  isFormValid,
  onCancel
}) => {
  return (
    <DialogFooter className="mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isUploading}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isUploading || !isFormValid}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload Document'
        )}
      </Button>
    </DialogFooter>
  );
};

export default DocumentFormActions;
