
import React, { useRef, useState } from 'react';
import { Upload, X, Camera, ImageIcon, Crop, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CameraCapture from '@/components/photos/CameraCapture';
import { useImageDragDrop } from '@/hooks/useImageDragDrop';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Cropper from 'react-easy-crop';
import { Slider } from '@/components/ui/slider';

interface PhotoInputProps {
  onChange: (file: File | null) => void;
  value: File | null;
}

// Helper function to create an image from a URL
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

// Helper function to get a cropped image
const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
  try {
    // Create a new image with the source
    const image = await createImage(imageSrc);
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Set canvas dimensions to the cropped size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Convert the canvas to a data URL
    return canvas.toDataURL('image/jpeg', 0.9);
  } catch (error) {
    console.error('Error cropping image:', error);
    throw new Error('Failed to crop image. Please try again.');
  }
};

// Helper function to convert base64 to blob
const dataURLtoBlob = (dataurl: string): Blob => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

const PhotoInput: React.FC<PhotoInputProps> = ({ onChange, value }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop
  } = useImageDragDrop();
  
  const processSelectedFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image is too large. Please select an image under 5MB.');
      return;
    }
    
    // Reset cropper state
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    
    // Read the file and open the cropper
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        try {
          // Create a temporary image to ensure proper loading
          const img = new window.Image();
          img.onload = () => {
            // Once loaded, set the image for cropping
            setImageToCrop(reader.result.toString());
            setShowCropper(true);
          };
          img.onerror = () => {
            toast.error('Failed to process image. Please try again.');
          };
          img.src = reader.result.toString();
        } catch (error) {
          console.error('Error processing image:', error);
          toast.error('Failed to process image. Please try again.');
        }
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        processSelectedFile(e.target.files[0]);
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error('Failed to process image. Please try again.');
      }
    }
  };
  
  const handleCameraCapture = (file: File) => {
    // Hide camera after capture
    setShowCamera(false);
    
    // Process the captured photo for cropping
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setImageToCrop(reader.result.toString());
        setShowCropper(true);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const clearPhoto = () => {
    onChange(null);
    setPhotoPreview(null);
  };
  
  const handleFileDropped = (file: File) => {
    processSelectedFile(file);
  };
  
  // Handle crop completion
  const onCropComplete = (_croppedArea: any, croppedAreaPixelsValue: any) => {
    setCroppedAreaPixels(croppedAreaPixelsValue);
  };
  
  // Apply the crop
  const handleCropFinish = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    
    try {
      setIsProcessing(true);
      
      // Generate the cropped image
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      
      // Convert to blob and then to file
      const blob = dataURLtoBlob(croppedImage);
      const fileName = `pet_photo_${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      // Update the preview
      setPhotoPreview(croppedImage);
      
      // Provide the file to the parent component
      onChange(file);
      
      // Close the cropper
      setShowCropper(false);
      setImageToCrop(null);
      
      // Show success message
      toast.success('Photo added successfully');
      
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Cancel cropping
  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToCrop(null);
  };
  
  // If camera is active, show the camera capture UI
  if (showCamera) {
    return <CameraCapture 
      onCapture={handleCameraCapture} 
      onCancel={() => setShowCamera(false)} 
    />;
  }
  
  // Render the cropper dialog
  const renderCropperDialog = () => {
    return (
      <Dialog open={showCropper} onOpenChange={(open) => !open && handleCropCancel()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Pet Photo</DialogTitle>
          </DialogHeader>
          
          {imageToCrop && (
            <div className="relative w-full h-80 mt-4">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="round"
                showGrid={false}
                objectFit="contain"
                restrictPosition={false}
              />
            </div>
          )}
          
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
            <Button variant="outline" onClick={handleCropCancel} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleCropFinish} disabled={isProcessing}>
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
  
  return (
    <>
      {/* Cropper Dialog */}
      {renderCropperDialog()}
      
      {/* Main Photo Input UI - Pure Tailwind responsive design */}
      <div
        className={cn(
          "relative w-full rounded-md border border-dashed border-gray-300 transition-colors cursor-pointer",
          "sm:h-[90px] h-[120px] flex items-center justify-center",
          isDragging ? "border-primary bg-primary/5" : photoPreview ? "border-transparent" : "hover:border-primary/50"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, handleFileDropped)}
      >
        {photoPreview ? (
        <>
          <img 
            src={photoPreview} 
            alt="Pet preview" 
            className="w-full h-full object-cover rounded-md"
          />
          <div className="absolute top-1 right-1 flex gap-1">
            <button
              type="button"
              onClick={() => {
                // Reset cropper state
                setCrop({ x: 0, y: 0 });
                setZoom(1);
                
                // Create a new image object to properly load the image before editing
                const img = new window.Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                  // Create a canvas to convert the image to a data URL
                  const canvas = document.createElement('canvas');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const dataUrl = canvas.toDataURL('image/jpeg');
                    setImageToCrop(dataUrl);
                    setShowCropper(true);
                  }
                };
                img.onerror = () => {
                  toast.error('Failed to load image for cropping');
                };
                // Add cache buster to prevent caching issues
                img.src = photoPreview.includes('?') ? 
                  `${photoPreview}&cb=${Date.now()}` : 
                  `${photoPreview}?cb=${Date.now()}`;
              }}
              className="w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
              title="Adjust crop"
            >
              <Crop size={12} />
            </button>
            <button
              type="button"
              onClick={clearPhoto}
              className="w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
              title="Remove photo"
            >
              <X size={12} />
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center w-full gap-6">
          <label 
            htmlFor="pet-photo" 
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="p-2 text-primary">
              <Upload className="w-6 h-6 sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs font-medium text-gray-600">Upload</span>
          </label>
          
          <button
            type="button"
            onClick={() => setShowCamera(true)}
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="p-2 text-primary">
              <Camera className="w-6 h-6 sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs font-medium text-gray-600">Camera</span>
          </button>
        </div>
      )}
      
      <input
        id="pet-photo"
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
        ref={fileInputRef}
      />
      </div>
    </>
  );
};

export default PhotoInput;
