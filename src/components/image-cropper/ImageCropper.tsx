import React, { useState, useCallback, useEffect } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getCroppedImg } from './cropImage';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
  cropShape?: 'rect' | 'round';
  open: boolean;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
  cropShape = 'round',
  open
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Reset state when a new image is provided
  useEffect(() => {
    if (image) {
      setIsImageLoading(true);
      setImageError(false);
      
      // Pre-load the image
      const img = new Image();
      img.onload = () => {
        setIsImageLoading(false);
      };
      img.onerror = () => {
        setIsImageLoading(false);
        setImageError(true);
        toast.error('Failed to load image for cropping');
      };
      img.src = image;
    }
  }, [image]);

  const onCropChange = (location: Point) => {
    setCrop(location);
  };

  const onZoomChange = (zoomValue: number) => {
    setZoom(zoomValue);
  };

  const onCropCompleteHandler = useCallback(
    (_: Area, croppedAreaPixelsValue: Area) => {
      setCroppedAreaPixels(croppedAreaPixelsValue);
    },
    []
  );

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return;
    
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error('Error creating cropped image:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Pet Image</DialogTitle>
        </DialogHeader>
        
        <div className="relative w-full h-80 mt-4">
          {isImageLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-sm text-gray-500">Loading image...</span>
            </div>
          ) : imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-red-500">Failed to load image</p>
            </div>
          ) : (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropCompleteHandler}
              cropShape={cropShape}
              showGrid={false}
            />
          )}
        </div>
        
        <div className="mt-4 px-1">
          <p className="text-sm text-gray-500 mb-2">Zoom</p>
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={(values) => setZoom(values[0])}
            className="w-full"
          />
        </div>
        
        <DialogFooter className="flex justify-between mt-6">
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={createCroppedImage} 
            disabled={isProcessing || isImageLoading || imageError}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : 'Apply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
