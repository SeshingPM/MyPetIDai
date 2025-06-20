
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onCapture: () => void;
  onCancel: () => void;
}

const CameraPreview: React.FC<CameraPreviewProps> = ({ 
  videoRef, 
  canvasRef, 
  onCapture, 
  onCancel 
}) => {
  return (
    <>
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-auto"
        />
        
        {/* Hidden canvas used for capturing */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Capture guidelines */}
        <div className="absolute inset-0 border-2 border-dashed border-white/40 rounded-lg pointer-events-none" />
      </div>
      
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        
        <Button onClick={onCapture}>
          <Camera className="mr-2 h-4 w-4" />
          Capture
        </Button>
      </div>
    </>
  );
};

export default CameraPreview;
