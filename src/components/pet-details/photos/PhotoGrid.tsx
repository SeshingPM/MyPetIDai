
import React from 'react';
import PhotoGridItem from './PhotoGridItem';
import { Photo } from '../types/photos';

interface PhotoGridProps {
  photos: Photo[];
  petName: string;
  isDeleting: boolean;
  onViewPhoto: (photo: Photo) => void;
  onDeletePhoto: (photoId: string) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  petName,
  isDeleting,
  onViewPhoto,
  onDeletePhoto
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map(photo => (
        <PhotoGridItem
          key={photo.id}
          photo={photo}
          petName={petName}
          isDeleting={isDeleting}
          onView={onViewPhoto}
          onDelete={onDeletePhoto}
        />
      ))}
    </div>
  );
};

export default PhotoGrid;
