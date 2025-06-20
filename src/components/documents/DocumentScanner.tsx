import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import logger from '@/utils/logger';

// Import custom hooks
import usePlatformDetection from './hooks/camera/usePlatformDetection';
import useCameraAccess from './hooks/camera/useCameraAccess';
import useMediaCapture from './hooks/camera/useMediaCapture';

// Import UI components
import CameraView from './camera/CameraView';
import CameraControls from './camera/CameraControls';
import ErrorDisplay from './ui/ErrorDisplay';
import FileInputFallback from './upload/FileInputFallback';

interface DocumentScannerProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({ 
  onCapture, 
  onCancel 
}) => {
  // Get platform-specific information
  const { 
    isIOS, 
    isAndroid, 
    isInIframe, 
    isPrivateMode,
    requiresUserInteraction,
    browserSupport
  } = usePlatformDetection();

  // State for UI control
  const [showFallback, setShowFallback] = useState(false);

  // Check camera support and show appropriate UI
  useEffect(() => {
    // On iOS, always try to access the camera regardless of detected support
    // The actual permission prompt is the only reliable way to determine support
    if (isIOS) {
      logger.info('[Camera] iOS device detected, bypassing initial device capability check');
      return;
    }
    
    // For desktop browsers, we need to check if camera access is available
    // but we shouldn't immediately show an error - instead, show the camera button
    // and let the user try to access the camera
    if (!browserSupport.hasMediaDevices) {
      logger.warn('[Camera] Media devices API not detected');
      
      // Don't immediately show fallback or error for desktop browsers
      // as they might have a camera but need permission first
      if (!isIOS && !isAndroid) {
        logger.info('[Camera] Desktop browser detected, showing camera button despite no detected media devices');
        // We'll let the user try to access the camera first
      } else {
        // For mobile non-iOS devices, we can be more strict
        logger.warn('[Camera] Media devices not supported on non-iOS mobile device, showing fallback');
        toast.error('Camera access is not supported on this device');
        setShowFallback(true);
      }
    }
    
    // Check if we're in a secure context (required for camera access)
    // Note: We've updated usePlatformDetection to treat localhost as secure
    if (!browserSupport.isSecureContext) {
      logger.warn('[Camera] Not in secure context, camera access will be blocked');
      
      // Check if we're on localhost or a trusted development environment
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.startsWith('192.168.') ||
                         window.location.hostname.startsWith('10.') ||
                         window.location.hostname.endsWith('.local');
      
      // Check for Vercel preview URLs
      const isVercelPreview = window.location.hostname.includes('vercel.app');
      
      // Check for production domain
      const isProductionDomain = window.location.hostname.includes('petdocument.com') || 
                                window.location.hostname === 'petdocument.com';
      
      // Log the current hostname for debugging
      logger.info(`[Camera] Current hostname: ${window.location.hostname}, isSecureContext: ${window.isSecureContext}`);
      
      // Consider localhost, Vercel previews, and production domain as trusted environments
      const isTrustedEnvironment = isLocalhost || isVercelPreview || isProductionDomain;
      
      if (!isTrustedEnvironment) {
        toast.error('Camera access requires a secure connection (HTTPS)');
        setShowFallback(true);
      } else {
        logger.info(`[Camera] Running on trusted environment (${window.location.hostname}), allowing camera access attempt`);
      }
    }
  }, [browserSupport.hasMediaDevices, browserSupport.isSecureContext, isIOS, isAndroid]);

  // Set up camera access
  const {
    stream,
    cameraReady,
    cameraError,
    isInitializing,
    mediaStreamReady,
    initializationAttempts,
    startCamera,
    stopCamera,
    handleCameraError,
    lastErrorTime,
  } = useCameraAccess({ 
    isAndroid, 
    isIOS,
    onError: () => {
      // Auto-fallback after too many errors
      if (initializationAttempts >= 3 && isAndroid) {
        setShowFallback(true);
      }
    }
  });

  // Set up media capture
  const {
    videoRef,
    canvasRef,
    capturedImage,
    isCapturing,
    captureImage,
    retakePhoto,
    setupVideoStream,
    setIsCapturing
  } = useMediaCapture({
    stopCamera,
    onCapture
  });

  // Connect the stream to the video when it changes
  useEffect(() => {
    setupVideoStream(stream);
  }, [stream, setupVideoStream]);

  // Handle orientation changes - especially important for Android
  useEffect(() => {
    const handleOrientationChange = () => {
      if (isCapturing && isAndroid) {
        logger.info('[Camera] Orientation change detected, restarting camera');
        // Briefly stop and restart the camera on orientation change
        stopCamera();
        // Small delay to allow for UI updates
        setTimeout(() => {
          startCamera();
        }, 500);
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isCapturing, isAndroid, stopCamera, startCamera]);

  // Fix for viewport issues across all mobile platforms
  useEffect(() => {
    if (isCapturing) {
      // Prevent scrolling while camera is active
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Add meta viewport tag to prevent user scaling during camera use
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      const originalContent = viewportMeta?.getAttribute('content');
      
      // Check for existing web app capable meta tags
      let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
      let mobileMeta = document.querySelector('meta[name="mobile-web-app-capable"]');
      
      // Store original values
      const originalAppleContent = appleMeta?.getAttribute('content');
      const originalMobileContent = mobileMeta?.getAttribute('content');
      
      // Update viewport meta
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      
      // Ensure both mobile web app capable meta tags are present and set to yes
      if (!appleMeta) {
        appleMeta = document.createElement('meta');
        appleMeta.setAttribute('name', 'apple-mobile-web-app-capable');
        document.head.appendChild(appleMeta);
      }
      
      if (!mobileMeta) {
        mobileMeta = document.createElement('meta');
        mobileMeta.setAttribute('name', 'mobile-web-app-capable');
        document.head.appendChild(mobileMeta);
      }
      
      // Set both to yes to ensure fullscreen camera
      appleMeta.setAttribute('content', 'yes');
      mobileMeta.setAttribute('content', 'yes');
      
      return () => {
        // Restore normal scrolling when camera is inactive
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        
        // Restore original viewport meta
        if (viewportMeta && originalContent) {
          viewportMeta.setAttribute('content', originalContent);
        }
        
        // Restore original web app capable meta tags
        if (appleMeta && originalAppleContent) {
          appleMeta.setAttribute('content', originalAppleContent);
        } else if (appleMeta) {
          document.head.removeChild(appleMeta);
        }
        
        if (mobileMeta && originalMobileContent) {
          mobileMeta.setAttribute('content', originalMobileContent);
        } else if (mobileMeta) {
          document.head.removeChild(mobileMeta);
        }
      };
    }
  }, [isCapturing]);

  // Delayed camera initialization with platform-specific timing
  useEffect(() => {
    // Longer delay for iOS to ensure DOM is fully ready and permissions are processed
    const delay = isAndroid ? 1000 : isIOS ? 1500 : 300;
    
    logger.info(`[Camera] Initializing camera with ${delay}ms delay for platform compatibility`);
    
    // First, try to release any existing camera resources
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(tempStream => {
          // Stop all tracks to release camera
          tempStream.getTracks().forEach(track => track.stop());
          logger.info('[Camera] Successfully released camera resources before initialization');
        })
        .catch(e => {
          logger.warn('[Camera] Could not pre-release camera:', e);
        });
    }
    
    // For iOS and Android, we need a more robust initialization sequence
    if (isIOS || isAndroid) {
      logger.info(`[Camera] Using special ${isIOS ? 'iOS' : 'Android'} initialization sequence`);
      
      // First delay to ensure DOM is ready
      const timer1 = setTimeout(() => {
        // For iOS, use the simplest possible constraint for permission request
        // This is the most reliable approach for iOS Safari
        navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: false 
        })
          .then(tempStream => {
            // Stop the temporary stream
            tempStream.getTracks().forEach(track => track.stop());
            logger.info(`[Camera] ${isIOS ? 'iOS' : 'Android'} permission granted, preparing camera`);
            
            // Second delay after permission is granted - much longer delay for iOS
            const timer2 = setTimeout(() => {
              startCamera();
            }, isAndroid ? 700 : 1500); // Even longer delay for iOS to ensure camera is ready
            
            return () => clearTimeout(timer2);
          })
          .catch(e => {
            logger.warn(`[Camera] ${isIOS ? 'iOS' : 'Android'} permission error:`, e);
            // Still try to start camera even if permission check fails
            startCamera();
          });
      }, delay);
      
      return () => clearTimeout(timer1);
    } else {
      // Desktop devices use simpler initialization
      const timer = setTimeout(() => {
        startCamera();
      }, delay);
      
      return () => clearTimeout(timer);
    }
    
    // No additional cleanup needed here as we've already returned cleanup functions
    // in the conditional blocks above
    return () => {};
  }, [startCamera, isAndroid, isIOS]);

  // Handle retry logic with debouncing
  const handleRetry = () => {
    if (Date.now() - lastErrorTime.current > 1000) {
      startCamera();
    }
  };

  // Switch to fallback mode
  const handleFallbackSwitch = () => {
    // Just set showFallback to true, no need to clear error state
    setShowFallback(true);
  };

  // We removed the iOS-specific camera view since we're not using it

  return (
    <div className="relative pb-safe"> {/* pb-safe class adds iOS-safe padding */}
      <div className="bg-black rounded-lg overflow-hidden mb-6 relative">
        {/* Main camera view */}
        {!showFallback && !capturedImage && (
          <CameraView
            videoRef={videoRef}
            isIOS={isIOS}
            isAndroid={isAndroid}
            isInIframe={isInIframe}
            isPrivateMode={isPrivateMode}
            requiresUserInteraction={requiresUserInteraction}
            cameraReady={cameraReady}
            isCapturing={isCapturing}
            isInitializing={isInitializing}
            initializationAttempts={initializationAttempts}
            startCamera={startCamera}
            onFallback={handleFallbackSwitch}
          />
        )}
        
        {/* Error display */}
        {cameraError && !isInitializing && !showFallback && (
          <ErrorDisplay 
            errorMessage={cameraError}
            onRetry={handleRetry}
            onFallback={handleFallbackSwitch}
            onCancel={onCancel}
            showRetry={initializationAttempts < 3}
            isIOS={isIOS}
            initializationAttempts={initializationAttempts}
          />
        )}
        
        {/* File input fallback when camera is unavailable */}
        {showFallback && (
          <div className="p-4">
            <FileInputFallback 
              onFileSelected={(file) => {
                logger.info('[Camera] Using file input fallback:', file.name);
                onCapture(file);
              }}
            />
          </div>
        )}
        
        {/* Captured image display */}
        {capturedImage && (
          <img 
            src={capturedImage} 
            alt="Captured document" 
            className="w-full h-full" 
          />
        )}
        
        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {/* Camera controls (if not in fallback mode) */}
      {!showFallback && (
        <CameraControls 
          isCapturing={isCapturing}
          capturedImage={capturedImage}
          onCapture={captureImage}
          onRetake={retakePhoto}
          onAccept={onCancel} // We've already passed the file to parent in captureImage
          onCancel={onCancel}
        />
      )}
    </div>
  );
};

export default DocumentScanner;
