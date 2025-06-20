
import React from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScannerButtonProps {
  setShowScanner: (show: boolean) => void;
  isUploading: boolean;
}

/**
 * ScannerButton - Desktop-only component for document scanning
 */
const ScannerButton: React.FC<ScannerButtonProps> = ({ setShowScanner, isUploading }) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full py-2 text-sm" 
      onClick={() => setShowScanner(true)}
      disabled={isUploading}
    >
      <Camera className="mr-2 h-4 w-4" />
      Scan Document
    </Button>
  );
};

export default ScannerButton;
