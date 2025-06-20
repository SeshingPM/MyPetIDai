
import React, { useState, useEffect, useCallback } from 'react';
import { usePets } from '@/contexts/PetsContext';
import PetProfilePictureUpload from '@/components/pets/PetProfilePictureUpload';
import { Skeleton } from '@/components/ui/skeleton';

interface PetPhotoProps {
  id: string;
  name: string;
  photoUrl?: string;
}

const PetPhoto: React.FC<PetPhotoProps> = ({ id, name, photoUrl }) => {
  const { updatePet, refetchPets } = usePets();
  const [isUploading, setIsUploading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [cacheBuster, setCacheBuster] = useState<string>(`${Date.now()}`);
  const [localPhotoUrl, setLocalPhotoUrl] = useState<string | undefined>(photoUrl);
  
  // Update local URL when prop changes
  useEffect(() => {
    if (photoUrl !== localPhotoUrl) {
      setLocalPhotoUrl(photoUrl);
      // Only update cache buster when URL actually changes
      setCacheBuster(`${Date.now()}`);
    }
  }, [photoUrl, localPhotoUrl]);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setIsImageLoading(true);
    try {
      // Update the pet with the new photo
      await updatePet(id, { 
        photoFile: file // Pass the file to be uploaded in the API
      });
      
      // Refetch pets to get the updated image URL
      await refetchPets();
      
      // Update cache buster to force image reload
      const newCacheBuster = `?t=${Date.now()}`;
      setCacheBuster(newCacheBuster);
      
      // Return a promise that resolves when the image has fully loaded
      return new Promise<void>((resolve) => {
        // Create a temporary image to ensure the new URL is fully loaded
        const img = new window.Image();
        img.onload = () => {
          // Image has loaded, resolve the promise after a short delay
          setTimeout(() => {
            setIsUploading(false);
            setIsImageLoading(false);
            resolve();
          }, 300);
        };
        img.onerror = () => {
          // Even if there's an error, resolve the promise
          setIsUploading(false);
          setIsImageLoading(false);
          resolve();
        };
        // Set the source with the new cache buster
        if (photoUrl) {
          img.src = photoUrl.includes('?') ? 
            `${photoUrl.split('?')[0]}${newCacheBuster}` : 
            `${photoUrl}${newCacheBuster}`;
        } else {
          // If no photo URL yet, just resolve
          setIsUploading(false);
          setIsImageLoading(false);
          resolve();
        }
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      setIsUploading(false);
      setIsImageLoading(false);
      throw error; // Let the PetProfilePictureUpload component handle the error
    }
  };
  
  // Function to handle image load events
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };
  
  // Function to handle image error events
  const handleImageError = () => {
    setIsImageLoading(false);
    // If image fails to load, try refetching pets again
    refetchPets();
  };
  
  // Handle crop completion (additional refresh to ensure image is updated)
  const handleCropComplete = useCallback(() => {
    // Force a refetch of pets data to get the latest image URL
    refetchPets().then(() => {
      // Set a new cache buster to force image reload
      const newCacheBuster = `${Date.now()}`;
      setCacheBuster(newCacheBuster);
      
      // Force a refresh of the local image URL if it already matches the prop
      // This helps when the URL is the same but the image content has changed
      if (photoUrl === localPhotoUrl) {
        setLocalPhotoUrl(undefined);
        setTimeout(() => {
          setLocalPhotoUrl(photoUrl);
        }, 50);
      }
    });
  }, [refetchPets, photoUrl, localPhotoUrl]);

  return (
    <div className="mb-4">
      <div className="flex flex-col items-center">
        {/* Display the pet photo or initial */}
        <div className="mb-4 w-full relative">
          {isImageLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Skeleton className="w-full h-48 rounded-lg" />
            </div>
          )}
          
          {localPhotoUrl ? (
            <img 
              src={localPhotoUrl.includes('supabase.co') || localPhotoUrl.includes('storage') ? 
                // Don't modify Supabase URLs which contain authentication tokens
                localPhotoUrl : 
                // For other URLs, add a cache buster
                (localPhotoUrl.includes('?') ? `${localPhotoUrl}&t=${cacheBuster}` : `${localPhotoUrl}?t=${cacheBuster}`)}
              alt={`${name} the pet`} 
              className={`w-full h-48 object-cover rounded-lg ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-pet-blue to-pet-purple flex items-center justify-center rounded-lg">
              <span className="text-6xl font-medium text-white">{name.charAt(0)}</span>
            </div>
          )}
        </div>
        
        {/* Profile picture upload with cropping */}
        <PetProfilePictureUpload
          onImageUpload={handleImageUpload}
          currentImageUrl={localPhotoUrl ? 
            (localPhotoUrl.includes('supabase.co') || localPhotoUrl.includes('storage') ? 
              // Don't modify Supabase URLs which contain authentication tokens
              localPhotoUrl : 
              // For other URLs, add a cache buster
              (localPhotoUrl.includes('?') ? `${localPhotoUrl}&t=${cacheBuster}` : `${localPhotoUrl}?t=${cacheBuster}`)) : null}
          isUploading={isUploading}
          onCropComplete={handleCropComplete}
        />
      </div>
    </div>
  );
};

export default PetPhoto;
