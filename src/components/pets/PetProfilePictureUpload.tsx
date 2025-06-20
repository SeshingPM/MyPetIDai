import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Pencil, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Cropper from 'react-easy-crop';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';

interface PetProfilePictureUploadProps {
  onImageUpload: (file: File) => Promise<void>;
  currentImageUrl?: string | null;
  isUploading?: boolean;
  onCropComplete?: () => void;
}

// Helper function to create an image from a URL
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    
    // Always set crossOrigin for all images to be used in canvas
    // This is required for canvas operations even if it might cause some URLs to fail loading
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

const PetProfilePictureUpload: React.FC<PetProfilePictureUploadProps> = ({
  onImageUpload,
  currentImageUrl,
  isUploading: externalIsUploading = false,
  onCropComplete
}) => {
  // State for controlling the image cropper
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // Keep a local cache of the original image data URL to avoid CORS issues when re-cropping
  const [originalImageDataUrl, setOriginalImageDataUrl] = useState<string | null>(null);

  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Ref to track image retry attempts
  const hasRetriedRef = useRef<boolean>(false);
  
  // Set initial preview image if available
  // Effect to handle cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any pending state to prevent memory leaks
      setImageToEdit(null);
      setCroppedAreaPixels(null);
      setShowCropper(false);
    };
  }, []);
  
  // Set initial preview image if available
  useEffect(() => {
    if (currentImageUrl) {
      setPreviewImage(currentImageUrl);
      setIsImageLoading(false); // Reset loading state when URL changes
    }
  }, [currentImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image is too large. Please select an image under 5MB.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      // Reset cropper state
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (reader.result) {
          try {
            // Store the original image data URL for later re-cropping
            // This is critical for avoiding CORS issues when the user wants to re-crop
            const imageDataUrl = reader.result.toString();
            setOriginalImageDataUrl(imageDataUrl);
            
            // Create a temporary image to ensure proper loading
            const img = new window.Image();
            img.onload = () => {
              // Once loaded, set the image for cropping
              setImageToEdit(imageDataUrl);
              setShowCropper(true);
            };
            img.onerror = () => {
              toast.error('Failed to process image. Please try again.');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            };
            img.src = imageDataUrl;
          } catch (error) {
            console.error('Error processing image:', error);
            toast.error('Failed to process image. Please try again.');
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }
        }
      });
      reader.addEventListener('error', () => {
        toast.error('Failed to read image file. Please try again.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      });
      reader.readAsDataURL(file);
    }
  };

  // This function is called when the user is done cropping
  const handleUpload = async () => {
    // Create a local reference to avoid race conditions
    const currentCroppedAreaPixels = croppedAreaPixels;
    const currentImageToEdit = imageToEdit;
    
    if (!currentCroppedAreaPixels || !currentImageToEdit) {
      toast.error('Please adjust the crop area first');
      return;
    }
    setIsUploading(true);
    
    try {
      // Get the cropped image as a base64 string
      const croppedImage = await getCroppedImg(currentImageToEdit, currentCroppedAreaPixels);
      
      // Convert the base64 string to a blob
      const blob = dataURLtoBlob(croppedImage);
      
      // Create a file from the blob
      const fileName = `pet-profile-${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      // Set preview image immediately for better UX
      setPreviewImage(croppedImage);
      
      // Upload the cropped image and wait for it to fully complete
      // The onImageUpload now returns a promise that resolves when the image is fully loaded
      await onImageUpload(file);
      
      // Close the cropper and update UI state
      setShowCropper(false);
      toast.success('Profile picture updated successfully');
      setIsUploading(false);
      
      // Set a flag in sessionStorage to indicate the photo was updated
      // This can be used by parent components if needed
      sessionStorage.setItem('photoUpdated', 'true');
      
      // Notify parent component about successful crop completion
      if (onCropComplete) {
        onCropComplete();
      }
      
      // No page reload needed - UI is already updated via state
    } catch (error) {
      console.error('Error uploading cropped image:', error);
      toast.error('Failed to upload image. Please try again.');
      setIsUploading(false);
    }
  };

  const handleCropCancel = () => {
    // Immediately hide the cropper dialog to prevent event propagation issues
    setShowCropper(false);
    
    // Clean up all resources with proper timing to prevent React event issues
    setTimeout(() => {
      // Reset all state in a specific order
      setCroppedAreaPixels(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      
      // Finally clear the image being edited
      setTimeout(() => {
        setImageToEdit(null);
        
        // Add extra logging for debugging
        console.log('Cropper cleanup complete');
      }, 200);
    }, 100);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // We need to memoize the crop handlers to prevent infinite updates
  const handleCropChange = useCallback((newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  }, []);
  
  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);
  
  const handleCropComplete = useCallback((croppedArea: any, pixelCropArea: any) => {
    setCroppedAreaPixels(pixelCropArea);
  }, []);
  
  const handleReEdit = useCallback(() => {
    // First close the current cropper to avoid state conflicts
    setShowCropper(false);
    
    // Reset state in a clean way
    setTimeout(() => {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      
      // Check if we have the cached version
      if (originalImageDataUrl) {
        setImageToEdit(originalImageDataUrl);
        setShowCropper(true);
      } else if (currentImageUrl) {
        // For existing images, we'll use a simpler approach
        // that avoids the security issues
        setImageToEdit(currentImageUrl); 
        setShowCropper(true);
        
        // Show info toast
        toast.info("Image loaded for cropping");
      } else {
        toast.error('No image available to edit');
      }
    }, 100); // Short delay to ensure clean state
  }, [originalImageDataUrl, currentImageUrl]);
  
  // We need this helper constant to determine when buttons should be disabled
  // It combines both local and external uploading states
  const isDisabled = isUploading || externalIsUploading;

  return (
    <div className="flex flex-col items-center">
      {/* Preview Area */}
      <div className="relative mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
          {isImageLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Skeleton className="w-full h-full rounded-full" />
            </div>
          )}
          
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Pet preview" 
              className={`w-full h-full object-cover ${isImageLoading ? 'opacity-30' : 'opacity-100'} transition-opacity duration-300`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                // Set loading to false silently
                setIsImageLoading(false);
                
                // Use our React ref to track retry attempts
                if (!hasRetriedRef.current && currentImageUrl) {
                  // Mark that we've attempted a retry to prevent multiple attempts
                  hasRetriedRef.current = true;
                  
                  // Try once with a cache buster
                  setTimeout(() => {
                    const newCacheBuster = Date.now();
                    const newUrl = currentImageUrl.includes('?') ? 
                      `${currentImageUrl.split('?')[0]}?t=${newCacheBuster}` : 
                      `${currentImageUrl}?t=${newCacheBuster}`;
                    setPreviewImage(newUrl);
                    
                    // Reset the retry flag after a while
                    setTimeout(() => {
                      hasRetriedRef.current = false;
                    }, 2000);
                  }, 300);
                }
              }}
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center justify-center">
              <Camera className="w-8 h-8 mb-1" />
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>
        
        {/* Edit overlay button */}
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isDisabled}
          className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors"
          aria-label="Change profile picture"
        >
          {isUploading || externalIsUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Pencil className="w-4 h-4" />
          )}
        </button>
      </div>
      
      {/* Upload Buttons */}
      <div className="flex gap-2">
        <Button 
          onClick={triggerFileInput} 
          variant="outline" 
          disabled={isDisabled}
          size="sm"
        >
          {previewImage ? 'Change Photo' : 'Upload Photo'}
        </Button>
        
        {previewImage && (
          <Button 
            onClick={handleReEdit} 
            variant="ghost" 
            disabled={isDisabled}
            size="sm"
            title="Adjust the cropping of your pet's photo"
          >
            Adjust Crop
          </Button>
        )}
      </div>
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload pet profile picture"
      />
      
      {/* Custom Cropper Dialog */}
      <Dialog 
        open={showCropper} 
        onOpenChange={(open) => {
          // Only handle close events (when open changes from true to false)
          if (!open) {
            handleCropCancel();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Pet Image</DialogTitle>
          </DialogHeader>
          
          {/* Only render the Cropper when both conditions are true */}
          {imageToEdit && showCropper && (
            <div className="relative w-full h-80 mt-4">
              <Cropper
                image={imageToEdit}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={handleCropChange}
                onZoomChange={handleZoomChange}
                onCropComplete={handleCropComplete}
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
            <Button variant="outline" onClick={handleCropCancel} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : 'Apply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PetProfilePictureUpload;
