
import React from 'react';
import { FileUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileDisplayProps {
  file: File;
  setFile: (file: File | null) => void;
  isUploading: boolean;
}

const FileDisplay: React.FC<FileDisplayProps> = ({ file, setFile, isUploading }) => {
  return (
    <div className="flex items-center p-2 border rounded gap-2">
      <FileUp size={16} />
      <span className="text-sm truncate flex-1">{file.name}</span>
      <Button
        type="button"
        variant="ghost" 
        size="sm"
        onClick={() => setFile(null)}
        disabled={isUploading}
      >
        <X size={14} />
      </Button>
    </div>
  );
};

export default FileDisplay;
