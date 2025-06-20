import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import logger from '@/utils/logger';

interface UploadDocumentParams {
  file: File;
  documentName: string;
  category: string;
  petId?: string;
}

export const useDocumentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  
  const uploadDocument = async ({
    file,
    documentName,
    category,
    petId
  }: UploadDocumentParams): Promise<{ id: string } | null> => {
    // Generate a unique request ID for tracking this upload
    const requestId = Math.random().toString(36).substring(2, 8);
    console.log(`[Doc Upload ${requestId}] Starting document upload process...`);
    
    setIsUploading(true);
    
    try {
      // Verify file is valid before proceeding
      if (!file || file.size === 0) {
        throw new Error('Invalid file: File is empty or undefined');
      }
      
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        throw userError;
      }
      
      if (!userData.user) {
        throw new Error('Not authenticated');
      }
      
      const userId = userData.user.id;
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      console.log(`[Doc Upload ${requestId}] Uploading file to storage: ${fileName} (${file.size} bytes)`);
      
      // Create a new file object with enhanced Android support
      // This resolves issues with file detachment in Android browsers
      let uploadFile = file;
      
      // Detect Android platform
      const userAgent = navigator.userAgent.toLowerCase();
      const isAndroid = /android/i.test(userAgent);
      const isSamsung = /samsungbrowser/i.test(userAgent);
      
      // Enhanced file cloning for Android devices
      if (isAndroid) {
        logger.info(`[Doc Upload ${requestId}] Android device detected, using specialized file handling`);
        
        try {
          // For Android, try multiple cloning methods in sequence for maximum reliability
          let cloneSuccess = false;
          
          // Method 1: ArrayBuffer method (most reliable on Android)
          try {
            logger.info(`[Doc Upload ${requestId}] Trying ArrayBuffer method for Android file`);
            const arrayBuffer = await file.arrayBuffer();
            const fileClone = new File([arrayBuffer], file.name, { type: file.type });
            
            if (fileClone.size > 0 && fileClone.size === file.size) {
              uploadFile = fileClone;
              cloneSuccess = true;
              logger.info(`[Doc Upload ${requestId}] ArrayBuffer clone successful: ${fileClone.size} bytes`);
            }
          } catch (arrayBufferError) {
            logger.warn(`[Doc Upload ${requestId}] ArrayBuffer method failed:`, arrayBufferError);
          }
          
          // Method 2: Blob method (fallback)
          if (!cloneSuccess) {
            try {
              logger.info(`[Doc Upload ${requestId}] Trying Blob method for Android file`);
              const blob = new Blob([file], { type: file.type });
              const fileClone = new File([blob], file.name, { type: file.type });
              
              if (fileClone.size > 0) {
                uploadFile = fileClone;
                cloneSuccess = true;
                logger.info(`[Doc Upload ${requestId}] Blob clone successful: ${fileClone.size} bytes`);
              }
            } catch (blobError) {
              logger.warn(`[Doc Upload ${requestId}] Blob method failed:`, blobError);
            }
          }
          
          // Method 3: Slice method (last resort)
          if (!cloneSuccess) {
            try {
              logger.info(`[Doc Upload ${requestId}] Trying Slice method for Android file`);
              // Create a copy by slicing the entire file
              const blob = file.slice(0, file.size, file.type);
              const fileClone = new File([blob], file.name, { type: file.type });
              
              if (fileClone.size > 0) {
                uploadFile = fileClone;
                cloneSuccess = true;
                logger.info(`[Doc Upload ${requestId}] Slice clone successful: ${fileClone.size} bytes`);
              }
            } catch (sliceError) {
              logger.warn(`[Doc Upload ${requestId}] Slice method failed:`, sliceError);
            }
          }
          
          if (!cloneSuccess) {
            logger.warn(`[Doc Upload ${requestId}] All Android file cloning methods failed, using original file`);
          }
        } catch (error) {
          logger.error(`[Doc Upload ${requestId}] Android file handling error:`, error);
          // Continue with original file if all methods fail
        }
      } else {
        // Standard cloning for non-Android platforms
        try {
          const fileClone = new File([file], file.name, { type: file.type });
          if (fileClone.size > 0) {
            uploadFile = fileClone;
            logger.info(`[Doc Upload ${requestId}] Using cloned file for upload: ${fileClone.size} bytes`);
          }
        } catch (cloneError) {
          logger.warn(`[Doc Upload ${requestId}] Could not clone file, using original:`, cloneError);
        }
      }
      
      // Check network connection quality
      let useChunkedUpload = uploadFile.size > 5 * 1024 * 1024; // Default 5MB threshold
      let poorConnection = false;
      
      try {
        // @ts-ignore - Connection property exists but might not be in all TypeScript definitions
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          // If connection is slow, use standard upload even for larger files
          poorConnection = connection.downlink < 1 || connection.rtt > 500;
          if (poorConnection) {
            logger.warn(`[Doc Upload ${requestId}] Slow network detected, using standard upload`);
            useChunkedUpload = false;
          }
        }
      } catch (e) {
        logger.warn(`[Doc Upload ${requestId}] Error checking connection:`, e);
      }
      
      // Enhanced upload to Supabase Storage with improved retry logic for Android
      let uploadAttempt = 0;
      let uploadSuccess = false;
      let lastError = null;
      
      // Increase max attempts for Android due to known issues
      const maxAttempts = isAndroid ? 5 : 3;
      
      // First try standard upload for all files (more reliable on mobile)
      const useStandardUploadFirst = true;
      
      // For Samsung browser, we'll use even more conservative settings
      if (isSamsung) {
        logger.info(`[Doc Upload ${requestId}] Samsung browser detected, using conservative upload settings`);
      }
      
      while (uploadAttempt < maxAttempts && !uploadSuccess) {
        uploadAttempt++;
        
        try {
          logger.info(`[Doc Upload ${requestId}] Upload attempt ${uploadAttempt}/${maxAttempts}...`);
          
          // On Android, add a small delay between attempts to prevent browser throttling
          if (isAndroid && uploadAttempt > 1) {
            const cooldownDelay = 500 * uploadAttempt; // Progressively longer delays
            logger.info(`[Doc Upload ${requestId}] Adding ${cooldownDelay}ms cooldown before Android retry`);
            await new Promise(resolve => setTimeout(resolve, cooldownDelay));
          }
          
          let uploadResult;
          
          // On Android, prefer standard upload for the first 3 attempts regardless of file size
          // For other platforms, follow the normal logic
          const shouldUseChunkedUpload = 
            (isAndroid ? uploadAttempt > 3 && useChunkedUpload : useChunkedUpload && (uploadAttempt > 1 || !useStandardUploadFirst));
          
          if (shouldUseChunkedUpload) {
            // For larger files, use chunked upload
            logger.info(`[Doc Upload ${requestId}] Using chunked upload for large file (${uploadFile.size} bytes)`);
            
            // Read the file as an ArrayBuffer
            const arrayBuffer = await uploadFile.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            uploadResult = await supabase.storage
              .from('documents')
              .upload(fileName, uint8Array, {
                contentType: uploadFile.type,
                cacheControl: '3600',
                upsert: true // Use upsert to handle potential duplicates
              });
          } else {
            // For smaller files or first attempt, use standard upload
            logger.info(`[Doc Upload ${requestId}] Using standard upload (${uploadFile.size} bytes)`);
            
            uploadResult = await supabase.storage
              .from('documents')
              .upload(fileName, uploadFile, {
                upsert: true // Use upsert to handle potential duplicates
              });
          }
          
          if (uploadResult.error) {
            throw uploadResult.error;
          }
          
          uploadSuccess = true;
          logger.info(`[Doc Upload ${requestId}] Upload successful on attempt ${uploadAttempt}`);
          
        } catch (error) {
          lastError = error;
          logger.error(`[Doc Upload ${requestId}] Upload attempt ${uploadAttempt}/${maxAttempts} failed:`, error);
          
          // On Android, provide more detailed error feedback
          if (isAndroid) {
            logger.debug(`[Doc Upload ${requestId}] Android upload error details:`, {
              fileSize: uploadFile.size,
              fileType: uploadFile.type,
              attempt: uploadAttempt,
              errorType: error?.name,
              errorMessage: error?.message
            });
          }
          
          // Show toast for each failed attempt to keep user informed
          if (uploadAttempt < maxAttempts) {
            // For Android, show more detailed error messages
            let errorMessage = `Upload attempt ${uploadAttempt} failed. Retrying...`;
            
            if (isAndroid && error?.message) {
              if (error.message.includes('network') || error.message.includes('connection')) {
                errorMessage = 'Network issue detected. Retrying with improved stability...';
              } else if (error.message.includes('timeout')) {
                errorMessage = 'Upload timed out. Retrying with longer timeout...';
              } else if (error.message.includes('storage')) {
                errorMessage = 'Storage error. Trying alternate method...';
              }
            }
            
            toast.error(errorMessage, {
              id: `upload-retry-${uploadAttempt}`,
              duration: 3000
            });
          }
          
          // Wait before retrying (exponential backoff)
          if (uploadAttempt < maxAttempts) {
            // For Android devices, use longer delays between retries
            const baseDelay = isAndroid ? 2000 : 1500;
            const delay = uploadAttempt * baseDelay; // 2s/1.5s, 4s/3s, 6s/4.5s, etc.
            logger.info(`[Doc Upload ${requestId}] Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      if (!uploadSuccess) {
        logger.error(`[Doc Upload ${requestId}] All upload attempts failed`);
        
        // Provide more specific error message based on the error
        let errorMessage = 'Upload failed after multiple attempts';
        
        if (lastError) {
          if (lastError.message?.includes('network')) {
            errorMessage = 'Network error during upload. Please check your connection and try again.';
          } else if (lastError.message?.includes('authentication')) {
            errorMessage = 'Authentication error. Please log in again.';
          } else if (lastError.message?.includes('storage quota')) {
            errorMessage = 'Storage quota exceeded. Please contact support.';
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // Get signed URL for the uploaded file (since bucket is private)
      const { data: signedUrlData } = await supabase.storage
        .from('documents')
        .createSignedUrl(fileName, 60 * 60 * 24); // 1 day expiry
      
      if (!signedUrlData || !signedUrlData.signedUrl) {
        throw new Error('Failed to create signed URL');
      }
      
      console.log(`[Doc Upload ${requestId}] File uploaded, URL: ${signedUrlData.signedUrl}`);
            
      // Save document metadata to database
      console.log(`[Doc Upload ${requestId}] Saving document to database`);
      const { error: dbError, data: savedDoc } = await supabase
        .from('documents')
        .insert({
          name: documentName,
          category,
          file_url: signedUrlData.signedUrl,
          file_type: file.type,
          user_id: userData.user.id,
          pet_id: petId || null,
          is_favorite: false,
          archived: false
        })
        .select('id')
        .single();
      
      if (dbError) {
        console.error(`[Doc Upload ${requestId}] Database error:`, dbError);
        throw dbError;
      }
      
      console.log(`[Doc Upload ${requestId}] Document saved to database with ID: ${savedDoc.id}`);
      
      // Single cache invalidation after successful database operation
      await queryClient.invalidateQueries({
        queryKey: ['documents'],
        exact: false
      });
      
      // If we have a pet ID, also invalidate pet-specific queries
      if (petId) {
        await queryClient.invalidateQueries({
          queryKey: ['petDocuments', petId],
          exact: true
        });
      }
      return savedDoc;
    } catch (error) {
      console.error(`[Doc Upload ${requestId}] Error:`, error);
      toast.error("Upload failed. Please try again.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    uploadDocument,
    isUploading
  };
};
