import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface CameraAccessOptions {
  isAndroid: boolean;
  isIOS: boolean;
  onError?: (error: Error) => void;
}

interface CameraAccessState {
  stream: MediaStream | null;
  cameraReady: boolean;
  cameraError: string | null;
  isInitializing: boolean;
  mediaStreamReady: boolean;
  initializationAttempts: number;
  lowPerformance: boolean;
}

export const useCameraAccess = ({ isAndroid, isIOS, onError }: CameraAccessOptions) => {
  const [state, setState] = useState<CameraAccessState>({
    stream: null,
    cameraReady: false,
    cameraError: null,
    isInitializing: false,
    mediaStreamReady: false,
    initializationAttempts: 0,
    lowPerformance: false,
  });

  // References for managing timeout and tracking
  const lastErrorTime = useRef<number>(0);
  const initializingRef = useRef<boolean>(false);
  const timeoutRef = useRef<number | null>(null);
  
  // Get network info for quality adjustments
  useEffect(() => {
    const checkConnection = () => {
      // @ts-ignore - Connection property exists but might not be in all TypeScript definitions
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (connection) {
        const isSlow = connection.downlink < 1 || connection.rtt > 500;
        if (isSlow) {
          logger.warn('[Camera] Slow network detected, reducing image quality');
          setState(prev => ({ ...prev, lowPerformance: true }));
        }
      }
    };
    
    checkConnection();
    
    // Listen for connection changes if supported
    if ('connection' in navigator) {
      try {
        // @ts-ignore
        navigator.connection?.addEventListener('change', checkConnection);
        
        return () => {
          // @ts-ignore
          navigator.connection?.removeEventListener('change', checkConnection);
        };
      } catch (e) {
        logger.warn('[Camera] Connection API error:', e);
      }
    }
  }, []);

  // Helper for handling camera errors
  const handleCameraError = useCallback((error: Error) => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Ensure we don't log too many errors
    if (Date.now() - lastErrorTime.current < 1000) {
      return;
    }
    
    lastErrorTime.current = Date.now();
    
    // Set detailed error messages
    let errorMessage = 'Could not access camera. Please try again.';
    
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Camera access denied. Please check permissions and try again.';
      // Log more details for permission errors
      logger.warn('[Camera] Permission denied. This could be due to browser settings or system permissions.');
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No camera found on this device.';
      logger.warn('[Camera] No camera detected. This could be due to hardware issues or missing drivers.');
    } else if (error.name === 'NotReadableError' || error.name === 'AbortError') {
      errorMessage = 'Camera is already in use by another application.';
      logger.warn('[Camera] Camera in use or hardware error. Try closing other applications that might be using the camera.');
    } else if (error.name === 'OverconstrainedError') {
      errorMessage = 'Camera does not support the requested settings.';
      logger.warn('[Camera] Camera constraints not supported. Will try with more permissive settings.');
    } else if (error.message === 'Camera access timed out') {
      errorMessage = 'Camera initialization timed out. Please try again.';
      logger.warn('[Camera] Timeout could be due to slow hardware or browser issues.');
    } else if (error.message?.includes('multiple attempts')) {
      errorMessage = 'Failed to access camera with current settings. Try uploading instead.';
      logger.warn('[Camera] Multiple attempts failed. This might indicate a deeper compatibility issue.');
    } else if (error.name === 'SecurityError') {
      errorMessage = 'Camera access blocked due to security settings. Try using HTTPS or check browser settings.';
      logger.warn('[Camera] Security error. This often happens in non-secure contexts or with certain browser policies.');
    }
    
    setState(prev => ({ 
      ...prev, 
      cameraError: errorMessage,
      isInitializing: false,
      initializationAttempts: prev.initializationAttempts + 1
    }));
    
    toast.error(errorMessage);
    
    // Call the error handler if provided
    if (onError) {
      onError(error);
    }
    
    logger.error('[Camera] Error accessing camera:', error);
  }, [onError]);

  // Start camera with progressive constraints for better compatibility
  const startCamera = useCallback(async () => {
    // Prevent multiple simultaneous initialization attempts
    if (initializingRef.current) {
      logger.debug('[Camera] Camera initialization already in progress');
      return;
    }
    
    // Reset state and mark as initializing
    initializingRef.current = true;
    setState(prev => ({
      ...prev, 
      isInitializing: true,
      cameraError: null,
      cameraReady: false
    }));
    
    try {
      // Clear any existing streams properly
      if (state.stream) {
        state.stream.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (e) {
            logger.warn('[Camera] Error stopping track:', e);
          }
        });
        setState(prev => ({ ...prev, stream: null }));
      }
      
      // Force garbage collection to release camera resources
      if ('gc' in window) {
        try {
          // @ts-ignore
          window.gc();
        } catch (e) {
          // Some browsers throw on window.gc()
        }
      }
      
      // Check API support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported on this device/browser');
      }
      
      // Explicitly request camera permission first on Android
      if (isAndroid) {
        try {
          await navigator.permissions.query({ name: 'camera' as PermissionName });
          logger.info('[Camera] Explicitly requested camera permission on Android');
        } catch (e) {
          logger.warn('[Camera] Permission API not supported, continuing with getUserMedia:', e);
        }
      }
      
      // Try a sequence of increasingly permissive constraints for better compatibility
      let constraintOptions = [];
      
      if (isIOS) {
        // iOS-specific constraints - use absolute minimum constraints for iOS Safari
        // Safari is extremely picky about camera constraints
        constraintOptions = [
          // First try: Super basic constraint - just video: true
          // This is the most reliable for iOS Safari
          {
            audio: false,
            video: true
          },
          // Second try: Basic environment camera with minimal constraints
          {
            audio: false,
            video: {
              facingMode: 'environment'
            }
          },
          // Third try: Try to select back camera by index
          {
            audio: false,
            video: { deviceId: { ideal: 'back' } }
          }
        ];
      } else if (isAndroid) {
        // Android-specific constraints - prioritize back camera with exact constraints first
        constraintOptions = [
          // First try: Exact environment camera (back camera) with exact constraint
          {
            audio: false,
            video: {
              facingMode: { exact: 'environment' }
            }
          },
          // Second try: Environment camera with ideal constraint
          {
            audio: false,
            video: {
              facingMode: 'environment'
            }
          },
          // Third try: Environment camera with reduced resolution
          {
            audio: false,
            video: {
              facingMode: 'environment',
              width: { ideal: 1024 },
              height: { ideal: 576 } 
            }
          },
          // Fourth try: Try to select back camera by index (sometimes works on Android)
          {
            audio: false,
            video: { deviceId: { ideal: 'back' } }
          },
          // Fifth try: Any front camera (only if all environment attempts fail)
          {
            audio: false,
            video: {
              facingMode: { exact: 'user' }
            }
          },
          // Last resort: Any camera, any parameters
          {
            audio: false,
            video: true
          }
        ];
      } else {
        // Desktop browser constraints
        constraintOptions = [
          // First try: High quality
          {
            audio: false,
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          },
          // Second try: Medium quality
          {
            audio: false,
            video: {
              width: { ideal: 1024 },
              height: { ideal: 768 }
            }
          },
          // Last resort: Any camera
          {
            audio: false,
            video: true
          }
        ];
      }
      
      // Add timeout with longer period for iOS devices
      const timeoutMs = isAndroid ? 15000 : isIOS ? 20000 : 10000;
      const timeoutPromise = new Promise<MediaStream>((_, reject) => {
        const id = window.setTimeout(() => {
          logger.warn(`[Camera] Camera access timed out after ${timeoutMs}ms`);
          reject(new Error('Camera access timed out'));
        }, timeoutMs);
        
        // Store the timeout ID for cleanup
        timeoutRef.current = id;
      });
      
      // Initialize mediaStream variable
      let mediaStream = null;
      let errorMessages = [];
      
      // For iOS, we need a completely different approach
      if (isIOS) {
        try {
          // For iOS, we'll use a simpler approach - just get any camera first
          logger.info('[Camera] iOS special initialization: Getting any camera first');
          
          // We won't stop this stream immediately - we'll use it directly
          // This is key for iOS Safari - it needs a continuous stream without interruption
          const iosStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: false 
          });
          
          logger.info('[Camera] iOS camera initialized with basic constraints');
          
          // If we got a stream with the basic constraint, check if it's the front camera
          // and try to switch to back camera if needed
          const videoTrack = iosStream.getVideoTracks()[0];
          if (videoTrack) {
            const settings = videoTrack.getSettings();
            logger.info('[Camera] iOS camera settings:', settings);
            
            // If we can determine it's the front camera, try to get the back camera
            if (settings.facingMode === 'user') {
              logger.info('[Camera] iOS front camera detected, attempting to switch to back camera');
              
              try {
                // Try to get the back camera
                const backStream = await navigator.mediaDevices.getUserMedia({
                  video: { facingMode: 'environment' },
                  audio: false
                });
                
                // Stop the original stream
                iosStream.getTracks().forEach(track => track.stop());
                
                // Use the back camera stream
                mediaStream = backStream;
                logger.info('[Camera] iOS successfully switched to back camera');
              } catch (e) {
                logger.warn('[Camera] iOS could not switch to back camera:', e);
                // Continue with the front camera if we can't get the back camera
                mediaStream = iosStream;
              }
            } else {
              // Already using the back camera or can't determine
              mediaStream = iosStream;
            }
          } else {
            // No video track found, use the stream anyway
            mediaStream = iosStream;
          }
        } catch (e) {
          logger.warn('[Camera] iOS special initialization failed:', e);
          // Continue with normal initialization if the special approach fails
        }
      } else if (isAndroid) {
        try {
          // First, try to release any existing camera resources
          logger.info('[Camera] Android pre-initialization: Releasing existing camera resources');
          const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          tempStream.getTracks().forEach(track => track.stop());
          
          // Small delay to ensure resources are released
          await new Promise(resolve => setTimeout(resolve, 300));
          
          logger.info('[Camera] Android pre-initialization complete');
        } catch (e) {
          logger.warn('[Camera] Android pre-initialization error (non-critical):', e);
          // Continue anyway - this is just a preparatory step
        }
      }
      
      // If we already have a stream from iOS special handling, skip the normal constraint loop
      if (!mediaStream) {
      
        // Try each constraint option in sequence
        for (const constraints of constraintOptions) {
        try {
          logger.info(`[Camera] Trying camera constraints:`, constraints);
          
          // For iOS and Android, we need to handle getUserMedia differently
          if (isIOS || isAndroid) {
            try {
              // First attempt without timeout
              mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            } catch (mobileErr) {
              logger.warn(`[Camera] ${isIOS ? 'iOS' : 'Android'} first attempt failed:`, mobileErr);
              
              // Small delay before retry
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Second attempt with timeout
              mediaStream = await Promise.race<MediaStream>([
                navigator.mediaDevices.getUserMedia(constraints),
                timeoutPromise
              ]);
            }
          } else {
            // Desktop devices use timeout approach
            mediaStream = await Promise.race<MediaStream>([
              navigator.mediaDevices.getUserMedia(constraints),
              timeoutPromise
            ]);
          }
          
          // If we got here, we succeeded
          logger.info(`[Camera] Successfully accessed camera with constraints:`, constraints);
          break;
        } catch (err) {
          // Collect errors but continue trying other constraints
          errorMessages.push(`${err.name}: ${err.message}`);
          logger.warn(`[Camera] Failed with constraints:`, constraints, err);
        }
        }
      }
      
      // If we still don't have a stream after trying all options
      if (!mediaStream) {
        throw new Error(`Failed to access camera after multiple attempts: ${errorMessages.join(', ')}`);
      }
      
      // Clear timeout to prevent memory leaks
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Get video tracks and log info - useful for debugging
      const videoTracks = mediaStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const track = videoTracks[0];
        logger.info(`[Camera] Using video device: ${track.label}`);
        
        // Get track capabilities/settings if supported
        try {
          const capabilities = track.getCapabilities?.();
          const settings = track.getSettings?.();
          if (capabilities || settings) {
            logger.info('[Camera] Track details:', { capabilities, settings });
          }
        } catch (e) {
          logger.warn('[Camera] Could not get track details:', e);
        }
      }
      
      // Update state with the new stream
      setState(prev => ({
        ...prev,
        stream: mediaStream,
        isInitializing: false,
        cameraReady: true
      }));
      
      logger.info('[Camera] Camera stream connected successfully');
      
    } catch (error) {
      handleCameraError(error);
      initializingRef.current = false;
    }
  }, [state.stream, isAndroid, isIOS, handleCameraError]);

  // Stop camera and clean up resources
  const stopCamera = useCallback(() => {
    if (state.stream) {
      try {
        // Explicitly stop each track
        state.stream.getTracks().forEach(track => {
          track.stop();
          logger.info(`[Camera] Stopped track: ${track.kind}`);
        });
        
        // Force garbage collection hint
        setState(prev => ({
          ...prev, 
          stream: null,
          cameraReady: false,
          mediaStreamReady: false
        }));
        
        // For Android WebView, this can help with memory issues
        if ('gc' in window) {
          try {
            // @ts-ignore
            window.gc();
          } catch (e) {
            // Some browsers throw on window.gc()
          }
        }
      } catch (error) {
        logger.error('[Camera] Error stopping camera:', error);
      }
    }
  }, [state.stream]);

  // Automatically clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [stopCamera]);

  return {
    ...state,
    startCamera,
    stopCamera,
    handleCameraError,
    lastErrorTime,
    timeoutRef,
  };
};

export default useCameraAccess;
