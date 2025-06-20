
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Trash } from 'lucide-react';
import { Photo } from '../types/photos';

interface PhotoGridItemProps {
  photo: Photo;
  petName: string;
  isDeleting: boolean;
  onView: (photo: Photo) => void;
  onDelete: (photoId: string) => void;
}

const PhotoGridItem: React.FC<PhotoGridItemProps> = ({
  photo,
  petName,
  isDeleting,
  onView,
  onDelete
}) => {
  return (
    <div key={photo.id} className="relative group overflow-hidden rounded-md">
      <img 
        src={photo.url} 
        alt={photo.caption || `Photo of ${petName}`}
        className="w-full aspect-square object-cover"
      />
      {photo.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
          {photo.caption}
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => onView(photo)}
            className="transform scale-90 hover:scale-100 transition-transform"
          >
            <Eye size={16} className="mr-2" />
            View
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDelete(photo.id)}
            className="transform scale-90 hover:scale-100 transition-transform"
            disabled={isDeleting}
          >
            <Trash size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoGridItem;
