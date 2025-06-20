import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logger from '@/utils/logger';

interface FileInputFallbackProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  disabled?: boolean;
}

/**
 * Fallback component for when camera access fails or is unavailable
 * Provides a simple file input as an alternative method to upload documents
 */
const FileInputFallback: React.FC<FileInputFallbackProps> = ({
  onFileSelected,
  accept = "image/*,application/pdf",
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isProcessing = false;
  

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent default form behavior
    e.preventDefault();
    e.stopPropagation();
    
    logger.info(`[FileInputFallback] File selection triggered`);
    
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      logger.info(`[FileInputFallback] File selected: ${file.name} (${file.type}, ${file.size} bytes)`);
      
      try {
        // Standard file cloning
        const fileClone = new File([file], file.name, { type: file.type });
        
        // Verify the clone was successful
        if (fileClone.size === 0 && file.size > 0) {
          logger.warn('[FileInputFallback] File clone has zero size, using original file');
          onFileSelected(file);
        } else {
          logger.info(`[FileInputFallback] File cloned successfully: ${fileClone.size} bytes`);
          onFileSelected(fileClone);
        }
      } catch (error) {
        // If cloning fails, use the original file
        logger.error('[FileInputFallback] Error cloning file:', error);
        onFileSelected(file);
      }
      
      // Clear the input after processing
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 100);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,image/heic,application/pdf,.jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
        disabled={disabled}
        aria-label="File selector"
      />
      <Upload className="h-8 w-8 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500 mb-4 text-center">
        Camera unavailable. You can upload an image directly instead.
      </p>
      <Button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (disabled) {
            return;
          }
          
          logger.info(`[FileInputFallback] Button clicked`);
          
          // Clear the input first to ensure onChange fires
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          handleButtonClick();
        }}
        disabled={disabled}
        variant="outline"
        className="w-full py-3" // Larger touch target for mobile
      >
        {'Select a file'}
      </Button>
    </div>
  );
};

export default FileInputFallback;
