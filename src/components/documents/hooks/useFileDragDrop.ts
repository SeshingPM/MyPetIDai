
import { useState } from 'react';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface UseFileDragDropResult {
  isDragging: boolean;
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, setFile: (file: File | null) => void, fileInputRef: React.RefObject<HTMLInputElement>) => void;
}

export const useFileDragDrop = (): UseFileDragDropResult => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>, 
    setFile: (file: File | null) => void,
    fileInputRef: React.RefObject<HTMLInputElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      logger.info(`[FileDrop] File dropped: ${droppedFile.name} (${droppedFile.type}, ${droppedFile.size} bytes)`);
      
      // Detect platform for platform-specific handling
      const userAgent = navigator.userAgent.toLowerCase();
      const isAndroid = /android/i.test(userAgent);
      const isSamsung = /samsungbrowser/i.test(userAgent);
      
      try {
        // Create a file clone to ensure it's properly detached
        // This helps with browser inconsistencies
        let fileClone;
        
        if (isAndroid) {
          // For Android, use a more reliable cloning method with ArrayBuffer
          logger.info('[FileDrop] Using ArrayBuffer method for Android file cloning');
          try {
            // Read as array buffer first for more reliable cloning on Android
            const arrayBuffer = await droppedFile.arrayBuffer();
            fileClone = new File([arrayBuffer], droppedFile.name, { type: droppedFile.type });
          } catch (bufferError) {
            logger.warn('[FileDrop] ArrayBuffer cloning failed, falling back to standard method:', bufferError);
            fileClone = new File([droppedFile], droppedFile.name, { type: droppedFile.type });
          }
        } else {
          // Standard cloning for other platforms
          fileClone = new File([droppedFile], droppedFile.name, { type: droppedFile.type });
        }
        
        // Verify the file clone was created successfully
        if (fileClone.size === 0 && droppedFile.size > 0) {
          logger.warn('[FileDrop] File clone has zero size, using original file');
          setFile(droppedFile);
        } else {
          logger.info(`[FileDrop] File cloned successfully: ${fileClone.size} bytes`);
          setFile(fileClone);
        }
      } catch (error) {
        // If cloning fails, use the original file
        logger.error('[FileDrop] Error cloning file:', error);
        setFile(droppedFile);
      }
      
      // Update the input element for consistency - with better mobile browser compatibility
      if (fileInputRef.current) {
        try {
          // Clear the input first - this is important for Android
          fileInputRef.current.value = '';
          
          // For Android, we don't try to update the input files property
          // as it's unreliable and can cause issues
          if (!isAndroid && !isSamsung) {
            // Only try to update the input files property on non-Android devices
            // Check if DataTransfer is supported before using it
            if (typeof DataTransfer !== 'undefined') {
              try {
                // Try the standard approach
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(droppedFile);
                
                // Update the files property
                fileInputRef.current.files = dataTransfer.files;
                logger.info(`[FileDrop] Input element updated with file: ${droppedFile.name}`);
              } catch (innerError) {
                logger.warn(`[FileDrop] Failed to set files property: ${innerError?.message || 'Unknown error'}`);
                // Just rely on the setFile state update
              }
            } else {
              // DataTransfer not supported - common in some mobile browsers
              logger.warn('[FileDrop] DataTransfer API not available in this browser');
              // Just rely on the setFile state update
            }
          } else {
            logger.info('[FileDrop] Skipping input files update on Android for better compatibility');
          }
        } catch (error) {
          // Fallback for any other errors
          logger.warn(`[FileDrop] File handling error: ${error?.message || 'Unknown error'}`);
          // Just rely on the setFile state update instead
        }
      }
      
      // Trigger toast notification
      toast.success(`File "${droppedFile.name}" ready to upload`);
    } else {
      logger.warn('[FileDrop] No files found in drop event');
    }
  };

  return {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop
  };
};
