
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PhotoUploadForm from '@/components/photos/PhotoUploadForm';

interface AddPhotoDialogProps {
  isOpen: boolean;
  petId: string;
  petName: string;
  onOpenChange: (open: boolean) => void;
  onPhotoAdded: (uploadedPhotos: any) => void;
}

const AddPhotoDialog: React.FC<AddPhotoDialogProps> = ({
  isOpen,
  petId,
  petName,
  onOpenChange,
  onPhotoAdded
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Photos for {petName}</DialogTitle>
          <DialogDescription>
            Upload photos or take a new picture to create a gallery of your pet's best moments.
          </DialogDescription>
        </DialogHeader>
        <PhotoUploadForm 
          onSubmit={onPhotoAdded}
          petId={petId}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddPhotoDialog;
