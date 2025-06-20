import { useState } from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import { useNavigate } from 'react-router-dom';
import logger from '@/utils/logger';

/**
 * Hook to handle platform-specific document upload flows
 * Separates Android and iOS/desktop logic
 */
const usePlatformDocumentUpload = () => {
  const { isAndroid } = usePlatform();
  const navigate = useNavigate();
  
  // Document metadata for the current upload
  const [currentPetId, setCurrentPetId] = useState<string | undefined>(undefined);
  
  // Start document upload process based on platform
  const startDocumentUpload = (petId?: string) => {
    logger.info(`[PlatformUpload] Starting document upload${petId ? ' for pet ' + petId : ''}`);
    
    // Set pet ID for the current upload
    setCurrentPetId(petId);
    
    // For Android, redirect to the upload page
    if (isAndroid) {
      logger.info('[PlatformUpload] Using Android-specific upload page');
      navigate('/upload');
      return true; // indicates we're handling this platform specially
    }
    
    // For iOS/desktop, use the standard flow (return false to indicate standard flow should be used)
    logger.info('[PlatformUpload] Using standard upload flow');
    return false;
  };
  
  // Handle successful upload
  const handleUploadSuccess = () => {
    logger.info('[PlatformUpload] Document upload completed successfully');
    
    // Reset any state
    setCurrentPetId(undefined);
  };
  
  return {
    // Platform information
    isAndroid,
    
    // Current upload metadata
    currentPetId,
    
    // Methods
    startDocumentUpload,
    handleUploadSuccess
  };
};

export default usePlatformDocumentUpload;
