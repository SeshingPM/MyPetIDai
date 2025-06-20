
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';
import { toast } from 'sonner';
import { Photo } from './types/photos';
import { fetchPhotos, deletePhoto } from './photos/PhotosService';

// Import the new components
import PhotoGrid from './photos/PhotoGrid';
import LoadingPhotosState from './photos/LoadingPhotosState';
import EmptyPhotosState from './photos/EmptyPhotosState';
import ViewPhotoDialog from './photos/ViewPhotoDialog';
import AddPhotoDialog from './photos/AddPhotoDialog';

interface PhotosTabProps {
  petId: string;
  petName: string;
}

const PhotosTab: React.FC<PhotosTabProps> = ({ petId, petName }) => {
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewPhoto, setViewPhoto] = useState<Photo | null>(null);

  // Fetch pet photos when component mounts or petId changes
  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoading(true);
      try {
        const photosData = await fetchPhotos(petId);
        setPhotos(photosData);
      } catch (error) {
        console.error('Error fetching pet photos:', error);
        toast.error('Failed to load photos. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPhotos();
  }, [petId]);

  const handleAddPhoto = async (uploadedPhotos: any) => {
    // Close the dialog
    setIsAddPhotoOpen(false);
    
    try {
      // Refresh photos to show newly uploaded ones
      const photosData = await fetchPhotos(petId);
      setPhotos(photosData);
    } catch (error) {
      console.error('Error refreshing photos:', error);
      toast.error('Failed to refresh photos. Please try again.');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      await deletePhoto(photoId);
      
      // Update local state
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
      toast.success('Photo deleted successfully');
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewPhoto = (photo: Photo) => {
    setViewPhoto(photo);
  };

  const handleAccessCamera = () => {
    try {
      setIsAddPhotoOpen(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera. Please check permissions and try again.');
    }
  };

  return (
    <>
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Photos</h2>
          <Button 
            onClick={() => setIsAddPhotoOpen(true)}
            className="gap-2"
          >
            <Upload size={16} />
            Add Photos
          </Button>
        </div>
        
        {isLoading ? (
          <LoadingPhotosState />
        ) : photos.length > 0 ? (
          <PhotoGrid 
            photos={photos}
            petName={petName}
            isDeleting={isDeleting}
            onViewPhoto={handleViewPhoto}
            onDeletePhoto={handleDeletePhoto}
          />
        ) : (
          <EmptyPhotosState
            onAddPhoto={() => setIsAddPhotoOpen(true)}
            onTakePhoto={handleAccessCamera}
          />
        )}
      </GlassCard>

      {/* Add Photo Dialog */}
      <AddPhotoDialog
        isOpen={isAddPhotoOpen}
        petId={petId}
        petName={petName}
        onOpenChange={setIsAddPhotoOpen}
        onPhotoAdded={handleAddPhoto}
      />

      {/* View Photo Dialog */}
      <ViewPhotoDialog
        photo={viewPhoto}
        petName={petName}
        isOpen={!!viewPhoto}
        onOpenChange={(open) => !open && setViewPhoto(null)}
      />
    </>
  );
};

export default PhotosTab;
