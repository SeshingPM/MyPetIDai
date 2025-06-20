
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import PhotoPreview from './PhotoPreview';

interface PhotoGridProps {
  files: File[];
  captions: Record<string, string>;
  isUploading: boolean;
  onRemove: (index: number) => void;
  onCaptionChange: (index: number, value: string) => void;
  onAddMore: () => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  files,
  captions,
  isUploading,
  onRemove,
  onCaptionChange,
  onAddMore
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {files.map((file, index) => (
          <PhotoPreview 
            key={`${file.name}-${index}`}
            file={file}
            index={index}
            caption={captions[index.toString()] || ''}
            onRemove={onRemove}
            onCaptionChange={onCaptionChange}
          />
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={onAddMore}
          disabled={isUploading}
        >
          <Upload size={16} className="mr-2" />
          Add More Photos
        </Button>
      </div>
    </div>
  );
};

export default PhotoGrid;
