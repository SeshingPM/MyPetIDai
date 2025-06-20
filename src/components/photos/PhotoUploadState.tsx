
import React from 'react';
import PhotoGrid from './PhotoGrid';
import PhotoDropZone from './PhotoDropZone';

interface PhotoUploadStateProps {
  selectedFiles: File[];
  captions: Record<string, string>;
  isUploading: boolean;
  onRemove: (index: number) => void;
  onCaptionChange: (index: number, value: string) => void;
  onAddMore: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onCameraCapture: () => void;
}

const PhotoUploadState: React.FC<PhotoUploadStateProps> = ({
  selectedFiles,
  captions,
  isUploading,
  onRemove,
  onCaptionChange,
  onAddMore,
  onDragOver,
  onDrop,
  onCameraCapture
}) => {
  return (
    <>
      {selectedFiles.length > 0 ? (
        <PhotoGrid
          files={selectedFiles}
          captions={captions}
          isUploading={isUploading}
          onRemove={onRemove}
          onCaptionChange={onCaptionChange}
          onAddMore={onAddMore}
        />
      ) : (
        <PhotoDropZone
          onFileSelect={onAddMore}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onCameraCapture={onCameraCapture}
        />
      )}
    </>
  );
};

export default PhotoUploadState;
