
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Image } from 'lucide-react';

interface EmptyPhotosStateProps {
  onAddPhoto: () => void;
  onTakePhoto: () => void;
}

const EmptyPhotosState: React.FC<EmptyPhotosStateProps> = ({ onAddPhoto, onTakePhoto }) => {
  return (
    <div className="text-center py-8">
      <Image size={48} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-600 mb-2">No photos yet</h3>
      <p className="text-gray-500 mb-6">
        Add photos to create a gallery of your pet's best moments.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button 
          onClick={onAddPhoto}
          className="gap-2"
        >
          <Upload size={16} />
          Upload Photos
        </Button>
        <Button 
          variant="outline" 
          onClick={onTakePhoto}
          className="gap-2"
        >
          <Camera size={16} />
          Take Photo
        </Button>
      </div>
    </div>
  );
};

export default EmptyPhotosState;
