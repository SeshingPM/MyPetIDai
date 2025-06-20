
import React, { useRef, useEffect } from 'react';
import { FileUp } from 'lucide-react';
import { useFileDragDrop } from '../hooks/useFileDragDrop';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface FileDropZoneProps {
  setFile: (file: File | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ 
  setFile, 
  handleFileChange, 
  isUploading 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    isDragging, 
    handleDragEnter, 
    handleDragLeave, 
    handleDragOver, 
    handleDrop 
  } = useFileDragDrop();

  // Ensure the component is registered for global drag events
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Register global handlers to prevent browser default behavior
    window.addEventListener('dragover', preventDefaults);
    window.addEventListener('drop', preventDefaults);

    return () => {
      window.removeEventListener('dragover', preventDefaults);
      window.removeEventListener('drop', preventDefaults);
    };
  }, []);

  // Enhanced click handler for the dropzone to open file dialog with improved Android support
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUploading) {
      return; // Don't allow file selection during upload
    }
    
    if (fileInputRef.current) {
      // Detect platform with enhanced detection
      const userAgent = navigator.userAgent.toLowerCase();
      const isAndroid = /android/i.test(userAgent);
      const isIOS = /iphone|ipad|ipod/i.test(userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isSamsung = /samsungbrowser/i.test(userAgent);
      const isChrome = /chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent);
      const isAndroidChrome = isAndroid && isChrome;
      
      // Generate a unique ID for this file selection attempt (for debugging)
      const selectionId = Date.now().toString(36);
      logger.info(`[FileDropZone:${selectionId}] File selection initiated`);
      
      // Adjust delay based on device and browser
      const delay = isSamsung ? 800 : isAndroidChrome ? 500 : isAndroid ? 300 : isIOS ? 200 : 100;
      
      // Clear any existing file selection and reset the input
      if (fileInputRef.current.value) {
        fileInputRef.current.value = '';
        logger.info(`[FileDropZone:${selectionId}] Cleared existing input value`);
      }
      
      // Set a unique ID attribute to help track this input in debugging
      if (isAndroid) {
        fileInputRef.current.setAttribute('data-selection-id', selectionId);
      }
      
      // Log platform info for debugging
      logger.info(`[FileDropZone:${selectionId}] Opening file picker: Android: ${isAndroid}, Chrome: ${isChrome}, Samsung: ${isSamsung}, iOS: ${isIOS}`);
      
      // For Android, we need a special approach
      if (isAndroid) {
        // First, blur any active elements to ensure clean state
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        
        // For Samsung browser, add even more preparation steps
        if (isSamsung) {
          // Force a small layout recalculation to ensure the browser is responsive
          const tempDiv = document.createElement('div');
          tempDiv.style.height = '1px';
          document.body.appendChild(tempDiv);
          setTimeout(() => document.body.removeChild(tempDiv), 100);
          logger.info(`[FileDropZone:${selectionId}] Added extra preparation for Samsung browser`);
        }
        
        // Add a click attempt tracking system
        let clickAttempts = 0;
        const maxClickAttempts = 3;
        
        const attemptClick = () => {
          clickAttempts++;
          
          try {
            // Focus first to ensure the browser is paying attention
            fileInputRef.current?.focus();
            
            // Trigger the file input click
            fileInputRef.current?.click();
            logger.info(`[FileDropZone:${selectionId}] File input clicked (attempt ${clickAttempts}/${maxClickAttempts})`);
          } catch (error) {
            logger.error(`[FileDropZone:${selectionId}] Error triggering file input:`, error);
            
            // If we haven't exceeded max attempts, try again with increased delay
            if (clickAttempts < maxClickAttempts) {
              setTimeout(attemptClick, delay * clickAttempts);
            }
          }
        };
        
        // Initialize first click attempt after initial delay
        setTimeout(attemptClick, delay);
      } else {
        // Standard approach for other platforms
        setTimeout(() => {
          fileInputRef.current?.click();
          logger.info(`[FileDropZone:${selectionId}] File input clicked with ${delay}ms delay`);
        }, delay);
      }
    }
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isUploading) return;
    // Prevent default behavior only if not uploading
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isUploading) return;
    // Trigger click handler on touch end for better mobile experience
    handleClick(e as unknown as React.MouseEvent);
  };

  return (
    <div className="w-full">
      <div 
        className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-md cursor-pointer ${
          isDragging ? 'bg-blue-50 border-blue-300' : isUploading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, setFile, fileInputRef)}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="button"
        tabIndex={0}
        aria-label="Upload file"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <FileUp className={`w-10 h-10 mb-3 ${isDragging ? 'text-blue-500' : isUploading ? 'text-gray-300' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-500">
            <span className="font-semibold">{isUploading ? 'Uploading...' : 'Tap to upload'}</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PDF, JPG, PNG or other documents
          </p>
        </div>
      </div>
      <input
        id="file-upload"
        name="file-upload"
        type="file"
        className="hidden"
        onChange={(e) => {
          // Prevent form submission on Android
          e.preventDefault();
          e.stopPropagation();
          
          // Detect platform
          const userAgent = navigator.userAgent.toLowerCase();
          const isAndroid = /android/i.test(userAgent);
          
          if (isAndroid) {
            logger.info('[FileDropZone] Android file selection detected, using special handling');
            
            // For Android, we need to handle the file change in a way that prevents page refresh
            if (e.target.files && e.target.files.length > 0) {
              const selectedFile = e.target.files[0];
              
              // Create a clone of the file to detach it from the input
              try {
                // Read as array buffer for more reliable cloning on Android
                selectedFile.arrayBuffer().then(arrayBuffer => {
                  const fileClone = new File([arrayBuffer], selectedFile.name, { type: selectedFile.type });
                  logger.info(`[FileDropZone] Android file cloned: ${fileClone.name} (${fileClone.size} bytes)`);
                  
                  // Set the file using the provided callback
                  setFile(fileClone);
                  
                  // Clear the input after a delay
                  setTimeout(() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }, 300);
                }).catch(error => {
                  logger.error('[FileDropZone] Error cloning Android file:', error);
                  // Fall back to regular handling
                  handleFileChange(e);
                });
              } catch (error) {
                logger.error('[FileDropZone] Error in Android file handling:', error);
                // Fall back to regular handling
                handleFileChange(e);
              }
            }
          } else {
            // Use standard handling for non-Android platforms
            handleFileChange(e);
          }
        }}
        disabled={isUploading}
        ref={fileInputRef}
        aria-label="File input"
        accept="image/jpeg,image/png,image/heic,application/pdf,.jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};

export default FileDropZone;
