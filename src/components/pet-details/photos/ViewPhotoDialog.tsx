
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Photo } from '../types/photos';

interface ViewPhotoDialogProps {
  photo: Photo | null;
  petName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewPhotoDialog: React.FC<ViewPhotoDialogProps> = ({
  photo,
  petName,
  isOpen,
  onOpenChange
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-1 sm:p-2">
        <DialogTitle className="sr-only">
          {photo?.caption || `Photo of ${petName}`}
        </DialogTitle>
        <div className="relative">
          {photo && (
            <>
              <img 
                src={photo.url} 
                alt={photo.caption || `Photo of ${petName}`}
                className="w-full object-contain max-h-[80vh]"
              />
              {photo.caption && (
                <div className="bg-black/50 text-white p-2 text-sm absolute bottom-0 left-0 right-0">
                  {photo.caption}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPhotoDialog;
