
import React from 'react';
import PhotoUploadState from './PhotoUploadState';
import PhotoUploadActions from './PhotoUploadActions';
import CameraCapture from './CameraCapture';
import UploadFileInput from './UploadFileInput';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';

interface PhotoUploadFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  petId: string;
}

const PhotoUploadForm: React.FC<PhotoUploadFormProps> = ({ 
  onSubmit, 
  onCancel, 
  petId 
}) => {
  const {
    selectedFiles,
    isUploading,
    captions,
    showCamera,
    fileInputRef,
    handleFileChange,
    handleCameraCapture,
    handleCapturedImage,
    handleRemoveFile,
    handleCaptionChange,
    handleSubmit,
    handleDragOver,
    handleDrop,
    handleFileSelect,
    setShowCamera
  } = usePhotoUpload({
    petId,
    onSuccess: onSubmit
  });

  if (showCamera) {
    return (
      <CameraCapture 
        onCapture={handleCapturedImage}
        onCancel={() => setShowCamera(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PhotoUploadState
        selectedFiles={selectedFiles}
        captions={captions}
        isUploading={isUploading}
        onRemove={handleRemoveFile}
        onCaptionChange={handleCaptionChange}
        onAddMore={handleFileSelect}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onCameraCapture={handleCameraCapture}
      />
      
      <UploadFileInput
        fileInputRef={fileInputRef}
        onChange={handleFileChange}
        disabled={isUploading}
      />
      
      <PhotoUploadActions
        filesCount={selectedFiles.length}
        isUploading={isUploading}
        onCancel={onCancel}
      />
    </form>
  );
};

export default PhotoUploadForm;
