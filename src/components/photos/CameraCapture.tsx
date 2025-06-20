
import React, { useCallback } from 'react';
import { useCameraCapture } from '@/hooks/useCameraCapture';
import CameraError from './camera/CameraError';
import CameraPreview from './camera/CameraPreview';
import CapturedImage from './camera/CapturedImage';
import { toast } from 'sonner';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const {
    videoRef,
    canvasRef,
    capturedImage,
    error,
    startCamera,
    capturePhoto,
    resetCapture
  } = useCameraCapture();

  const handleUsePhoto = useCallback(() => {
    if (!capturedImage || !canvasRef.current) return;
    
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
      } else {
        toast.error('Failed to process captured image');
      }
    }, 'image/jpeg', 0.9);
  }, [capturedImage, canvasRef, onCapture]);

  // Show error state if camera access failed
  if (error) {
    return <CameraError errorMessage={error} onCancel={onCancel} />;
  }

  return (
    <div className="space-y-4">
      {!capturedImage ? (
        <CameraPreview 
          videoRef={videoRef}
          canvasRef={canvasRef}
          onCapture={capturePhoto}
          onCancel={onCancel}
        />
      ) : (
        <CapturedImage 
          imageUrl={capturedImage}
          canvasRef={canvasRef}
          onRetake={resetCapture}
          onConfirm={handleUsePhoto}
        />
      )}
    </div>
  );
};

export default CameraCapture;
