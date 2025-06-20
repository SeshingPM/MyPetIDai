import React from 'react';
import { Camera, RefreshCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraControlsProps {
  isCapturing: boolean;
  capturedImage: string | null;
  onCapture: () => void;
  onRetake: () => void;
  onAccept: () => void;
  onCancel: () => void;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  isCapturing,
  capturedImage,
  onCapture,
  onRetake,
  onAccept,
  onCancel
}) => {
  return (
    <div className="flex justify-between mt-2 mb-8 pb-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      
      {isCapturing && !capturedImage ? (
        <Button
          type="button"
          onClick={onCapture}
          className="py-3 px-5" // Increased button size for better tap target
        >
          <Camera className="mr-2 h-5 w-5" />
          Capture
        </Button>
      ) : capturedImage ? (
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onRetake}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retake
          </Button>
          <Button
            type="button"
            onClick={onAccept}
          >
            <Check className="mr-2 h-4 w-4" />
            Use Photo
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default CameraControls;
