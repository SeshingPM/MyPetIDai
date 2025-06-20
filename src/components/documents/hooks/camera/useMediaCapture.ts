import { useState, useRef, useCallback } from 'react';
import logger from '@/utils/logger';

interface MediaCaptureOptions {
  stopCamera: () => void;
  onCapture: (file: File) => void;
}

export const useMediaCapture = ({ stopCamera, onCapture }: MediaCaptureOptions) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Capture an image from the video stream
  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        // Log video dimensions for debugging
        logger.info(`[Camera] Video dimensions: ${video.videoWidth}x${video.videoHeight}`);
        
        // Ensure video has valid dimensions before capturing
        if (!video.videoWidth || !video.videoHeight) {
          logger.warn('[Camera] Video dimensions are invalid, cannot capture image');
          throw new Error('Video stream not ready');
        }
        
        // Set canvas size to match video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
          // Draw the video frame to the canvas
          const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha for better performance
          if (ctx) {
            // Clear the canvas first
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw the video frame
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Mobile browser fix: Force a read operation to ensure drawing is complete
            const imgData = ctx.getImageData(0, 0, 1, 1);
            if (imgData) {
              logger.info('[Camera] Canvas drawing verified');
            }
            
            // For Android, apply image processing to improve document clarity
            if (navigator.userAgent.includes('Android')) {
              try {
                // Increase contrast slightly for better document readability
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // Simple contrast adjustment
                const contrast = 1.1; // Slight increase in contrast
                const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
                
                for (let i = 0; i < data.length; i += 4) {
                  // Apply contrast adjustment to RGB channels
                  data[i] = factor * (data[i] - 128) + 128; // Red
                  data[i + 1] = factor * (data[i + 1] - 128) + 128; // Green
                  data[i + 2] = factor * (data[i + 2] - 128) + 128; // Blue
                  // Alpha channel remains unchanged
                }
                
                // Put the modified image data back on the canvas
                ctx.putImageData(imageData, 0, 0);
                logger.info('[Camera] Applied Android-specific image processing');
              } catch (e) {
                logger.warn('[Camera] Could not apply Android image processing:', e);
                // Continue without image processing if it fails
              }
            }
          
            // Convert canvas to data URL with appropriate quality for the device
            try {
              // Use lower quality for iOS, higher for Android (better document quality)
              const quality = navigator.userAgent.includes('Android') ? 0.92 : 0.85;
              const imageDataUrl = canvas.toDataURL('image/jpeg', quality);
            setCapturedImage(imageDataUrl);
            logger.info('[Camera] Image captured successfully');
            
            // Stop camera after successful capture
            stopCamera();
            
            // Convert data URL to File object with fallback for iOS
            try {
              canvas.toBlob((blob) => {
                if (blob) {
                  const file = new File([blob], `document-scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
                  onCapture(file);
                  logger.info('[Camera] Blob created successfully');
                } else {
                  logger.warn('[Camera] Blob creation failed, using data URL fallback');
                  // Fallback for iOS: Convert data URL to blob manually
                  const byteString = atob(imageDataUrl.split(',')[1]);
                  const mimeString = imageDataUrl.split(',')[0].split(':')[1].split(';')[0];
                  const ab = new ArrayBuffer(byteString.length);
                  const ia = new Uint8Array(ab);
                  
                  for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                  }
                  
                  const fallbackBlob = new Blob([ab], { type: mimeString });
                  const fallbackFile = new File([fallbackBlob], `document-scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
                  onCapture(fallbackFile);
                }
              }, 'image/jpeg', 0.85);
            } catch (blobError) {
              logger.error('[Camera] Error creating blob:', blobError);
              
              // Last resort fallback: Use data URL directly
              const byteString = atob(imageDataUrl.split(',')[1]);
              const mimeString = imageDataUrl.split(',')[0].split(':')[1].split(';')[0];
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              
              const fallbackBlob = new Blob([ab], { type: mimeString });
              const fallbackFile = new File([fallbackBlob], `document-scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
              onCapture(fallbackFile);
            }
          } catch (dataUrlError) {
            logger.error('[Camera] Error creating data URL:', dataUrlError);
            throw dataUrlError;
          }
        }
      } catch (error) {
        logger.error('[Camera] Error capturing image:', error);
        // Show a user-friendly error message
        alert('Could not capture image. Please try again or use file upload instead.');
      }
    }
  }, [onCapture, stopCamera]);
  
  // Reset the capture state to take another photo
  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setIsCapturing(true);
  }, []);

  // Set up video stream with the camera stream
  const setupVideoStream = useCallback((stream: MediaStream | null) => {
    if (stream && videoRef.current) {
      try {
        // First stop any existing tracks
        if (videoRef.current.srcObject) {
          try {
            const existingStream = videoRef.current.srcObject as MediaStream;
            existingStream.getTracks().forEach(track => track.stop());
          } catch (e) {
            logger.warn('[Camera] Error stopping existing tracks:', e);
          }
        }
        
        // Set the new stream
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
        
        // Wait for metadata before trying to play - important for Android
        videoRef.current.onloadedmetadata = () => {
          logger.info('[Camera] Video metadata loaded, attempting to play');
          playVideo();
        };
        
        // Add a fallback in case onloadedmetadata doesn't fire (happens on some devices)
        const metadataTimeout = setTimeout(() => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            logger.info('[Camera] Metadata timeout reached, video appears ready');
            playVideo();
          }
        }, 1000);
        
        // Clean up timeout
        return () => clearTimeout(metadataTimeout);
      } catch (error) {
        logger.error('[Camera] Error setting up video stream:', error);
      }
    } else {
      setIsCapturing(false);
    }
  }, []);

  // Play the video stream
  const playVideo = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      try {
        // Set a timeout to catch hanging play attempts (common on Android and sometimes on desktop)
        const playTimeout = setTimeout(() => {
          logger.warn('[Camera] Video.play() is taking too long, may be stalled');
          
          // Force a retry if play is stalled
          if (videoRef.current && videoRef.current.paused) {
            logger.info('[Camera] Forcing video play retry after stall');
            
            // Try to reset the srcObject before retrying
            const tempStream = videoRef.current.srcObject;
            videoRef.current.srcObject = null;
            
            // Small delay before restoring
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.srcObject = tempStream;
                videoRef.current.play().catch(e => 
                  logger.error('[Camera] Retry play failed:', e)
                );
              }
            }, 100);
          }
        }, 5000); // Increased timeout for iOS
        
        // Make sure video is visible and has proper attributes
        if (videoRef.current) {
          videoRef.current.style.display = 'block';
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.setAttribute('webkit-playsinline', 'true'); // For older iOS versions
          videoRef.current.setAttribute('autoplay', 'true');
          videoRef.current.muted = true;
          
          // Force hardware acceleration for iOS
          videoRef.current.style.transform = 'translateZ(0)';
          videoRef.current.style.webkitTransform = 'translateZ(0)';
          
          // Ensure opacity is set to 1 (iOS sometimes has issues with this)
          videoRef.current.style.opacity = '1';
        }
        
        // Add event listeners for better debugging
        videoRef.current.onloadeddata = () => {
          logger.info('[Camera] Video data loaded');
        };
        
        videoRef.current.onplaying = () => {
          logger.info('[Camera] Video is playing');
          setIsCapturing(true);
        };
        
        videoRef.current.play()
          .then(() => {
            clearTimeout(playTimeout);
            logger.info('[Camera] Video playback started');
            setIsCapturing(true);
          })
          .catch((error) => {
            clearTimeout(playTimeout);
            logger.error('[Camera] Error playing video:', error);
            setIsCapturing(false);
          });
      } catch (error) {
        logger.error('[Camera] Exception during video.play():', error);
        setIsCapturing(false);
      }
    }
  }, []);

  return {
    videoRef,
    canvasRef,
    capturedImage,
    isCapturing,
    captureImage,
    retakePhoto,
    setupVideoStream,
    setIsCapturing
  };
};

export default useMediaCapture;
