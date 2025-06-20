
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Check } from 'lucide-react';

interface CapturedImageProps {
  imageUrl: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onRetake: () => Promise<void>;
  onConfirm: () => void;
}

const CapturedImage: React.FC<CapturedImageProps> = ({ 
  imageUrl, 
  canvasRef, 
  onRetake, 
  onConfirm 
}) => {
  return (
    <>
      <div className="relative bg-black rounded-lg overflow-hidden">
        <img src={imageUrl} alt="Captured" className="w-full h-auto" />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onRetake}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retake
        </Button>
        
        <Button onClick={onConfirm}>
          <Check className="mr-2 h-4 w-4" />
          Use Photo
        </Button>
      </div>
    </>
  );
};

export default CapturedImage;
