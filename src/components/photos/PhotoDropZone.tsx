
import React from 'react';
import { Button } from '@/components/ui/button';
import { Image, Upload, Camera } from 'lucide-react';

interface PhotoDropZoneProps {
  onFileSelect: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onCameraCapture: () => void;
}

const PhotoDropZone: React.FC<PhotoDropZoneProps> = ({
  onFileSelect,
  onDragOver,
  onDrop,
  onCameraCapture
}) => {
  return (
    <div
      className="border-2 border-dashed rounded-lg p-8 text-center"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Image className="h-10 w-10 mx-auto text-gray-400 mb-3" />
      <h3 className="text-lg font-medium text-gray-600 mb-1">
        Drag photos here
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Or use one of the options below
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onFileSelect}
          className="w-full sm:w-auto"
        >
          <Upload size={16} className="mr-2" />
          Select Photos
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCameraCapture}
          className="w-full sm:w-auto"
        >
          <Camera size={16} className="mr-2" />
          Take Photo
        </Button>
      </div>
    </div>
  );
};

export default PhotoDropZone;
