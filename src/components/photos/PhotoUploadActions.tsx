
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PhotoUploadActionsProps {
  filesCount: number;
  isUploading: boolean;
  onCancel: () => void;
}

const PhotoUploadActions: React.FC<PhotoUploadActionsProps> = ({
  filesCount,
  isUploading,
  onCancel
}) => {
  return (
    <div className="flex gap-2 justify-end">
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
        disabled={filesCount === 0 || isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>Upload {filesCount} Photo{filesCount !== 1 && 's'}</>
        )}
      </Button>
    </div>
  );
};

export default PhotoUploadActions;
