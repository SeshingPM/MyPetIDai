
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface PhotoPreviewProps {
  file: File;
  index: number;
  caption: string;
  onRemove: (index: number) => void;
  onCaptionChange: (index: number, value: string) => void;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  file,
  index,
  caption,
  onRemove,
  onCaptionChange
}) => {
  return (
    <div className="relative border rounded-md p-2">
      <div className="aspect-square relative overflow-hidden rounded-md bg-gray-100">
        <img
          src={URL.createObjectURL(file)}
          alt={`Preview ${index + 1}`}
          className="object-cover w-full h-full"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full"
          onClick={() => onRemove(index)}
        >
          <X size={14} />
        </Button>
      </div>
      <div className="mt-2">
        <Input
          placeholder="Add a caption (optional)"
          value={caption}
          onChange={(e) => onCaptionChange(index, e.target.value)}
          className="text-xs"
        />
      </div>
    </div>
  );
};

export default PhotoPreview;
