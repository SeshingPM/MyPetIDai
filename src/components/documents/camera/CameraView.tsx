import React, { useCallback } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScanningOverlay from '../ui/ScanningOverlay';
import LoadingIndicator from '../ui/LoadingIndicator';
import logger from '@/utils/logger';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isIOS: boolean;
  isAndroid: boolean;
  isInIframe: boolean;
  isPrivateMode: boolean;
  requiresUserInteraction: boolean;
  cameraReady: boolean;
  isCapturing: boolean;
  isInitializing: boolean;
  initializationAttempts: number;
  startCamera: () => void;
  onFallback: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  isIOS,
  isAndroid,
  isInIframe,
  isPrivateMode,
  requiresUserInteraction,
  cameraReady,
  isCapturing,
  isInitializing,
  initializationAttempts,
  startCamera,
  onFallback
}) => {
  // Handle the video ref assignment
  const handleVideoRef = useCallback((video: HTMLVideoElement | null) => {
    if (videoRef.current !== video) {
      if (video) {
        // Set attributes for maximum compatibility across all platforms
        video.setAttribute('autoplay', 'true');
        video.setAttribute('muted', 'true');
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true'); // Older iOS versions
        
        // Force muted state for iOS Safari
        video.muted = true;
        
        // Ensure proper sizing
        video.style.width = '100%';
        video.style.height = '100%';
        
        // iOS-specific optimizations
        if (isIOS) {
          // Force hardware acceleration
          video.style.transform = 'translateZ(0)';
          video.style.webkitTransform = 'translateZ(0)';
          video.style.backfaceVisibility = 'hidden';
          video.style.webkitBackfaceVisibility = 'hidden';
          
          // Ensure video is visible
          video.style.display = 'block';
          video.style.opacity = '1';
          
          // Set explicit dimensions
          video.style.width = '100%';
          video.style.height = '100%';
          
          // Add iOS-specific event listeners
          video.addEventListener('loadedmetadata', () => {
            logger.info('[Camera] iOS video metadata loaded');
            // Force play on metadata loaded
            video.play().catch(e => logger.warn('[Camera] iOS play error:', e));
          });
          
          // Add canplay listener for iOS
          video.addEventListener('canplay', () => {
            logger.info('[Camera] iOS video can play event');
            video.play().catch(e => logger.warn('[Camera] iOS canplay error:', e));
          });
          
          // Add loadeddata listener for iOS
          video.addEventListener('loadeddata', () => {
            logger.info('[Camera] iOS video data loaded');
            video.play().catch(e => logger.warn('[Camera] iOS loadeddata error:', e));
          });
          
          // Add playing listener for iOS
          video.addEventListener('playing', () => {
            logger.info('[Camera] iOS video playing event');
            // Ensure video is visible when playing
            video.style.opacity = '1';
          });
          
          // Force play after a short delay
          setTimeout(() => {
            logger.info('[Camera] iOS forcing play after delay');
            video.play().catch(e => logger.warn('[Camera] iOS delayed play error:', e));
          }, 500);
        }
        
        if (isAndroid) {
          // Android may need specific video attributes
          video.style.transform = 'scaleX(1)'; // Fix potential mirroring issues
          video.style.objectFit = 'cover';
          
          // Force hardware acceleration for Android
          video.style.transform = 'translateZ(0)';
          video.style.webkitTransform = 'translateZ(0)';
          video.style.backfaceVisibility = 'hidden';
          video.style.webkitBackfaceVisibility = 'hidden';
          
          // Ensure proper display
          video.style.display = 'block';
          video.style.opacity = '1';
          
          // Ensure portrait orientation on Android
          if (window.orientation === 90 || window.orientation === -90) {
            video.style.transform = 'rotate(90deg) translateZ(0)';
          }
          
          // Add Android-specific event listeners
          video.addEventListener('loadedmetadata', () => {
            logger.info('[Camera] Android video metadata loaded');
            // Force play on metadata loaded
            video.play().catch(e => logger.warn('[Camera] Android play error:', e));
          });
          
          // Add canplay listener for Android
          video.addEventListener('canplay', () => {
            logger.info('[Camera] Android video can play event');
            video.play().catch(e => logger.warn('[Camera] Android canplay error:', e));
          });
        }
        
        // Add error handling for video element
        video.onerror = (e) => {
          logger.error('[Camera] Video element error:', e);
        };
      }
      
      // Update the ref
      if (videoRef && typeof videoRef === 'object') {
        (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = video;
      }
    }
  }, [videoRef, isAndroid]);

  // Show interaction button for:
  // 1. iOS devices (always require direct user interaction)
  // 2. When explicitly required by platform detection
  // 3. For desktop browsers to ensure proper camera access
  const isDesktop = !isIOS && !isAndroid;
  if ((isIOS || requiresUserInteraction || isDesktop) && !cameraReady && !isInitializing) {
    return (
      <div className="relative w-full bg-black h-[70vh] max-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-white text-center p-6">
          <Play className="w-16 h-16 mx-auto mb-4 text-blue-400" />
          <h3 className="text-lg font-bold mb-2">Camera Access</h3>
          <p className="mb-6">
            {isIOS 
              ? "On iOS, camera access requires your permission. Tap the button below to continue."
              : isDesktop
                ? "To scan a document with your camera, click the button below to grant camera access."
                : "Camera access requires your permission."}
          </p>
          
          <Button 
            type="button" 
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 py-3 px-6 text-base" // Larger touch target
            onClick={(e) => {
              // Ensure we have a direct user interaction
              e.preventDefault();
              
              // Log the user interaction for debugging
              logger.info('[Camera] User initiated camera access via button click');
              
              // This direct user interaction improves iOS camera reliability
              setTimeout(() => {
                startCamera();
                
                // For iframe/private mode, we need user gesture
                if (isIOS && (isInIframe || isPrivateMode)) {
                  // Manual permission request in case camera access is restricted
                  navigator.mediaDevices.getUserMedia({ video: true })
                    .catch(e => logger.warn('[Camera] Permission request error:', e));
                }
              }, 100); // Small delay to ensure the click event is fully processed
            }}
          >
            <Play className="mr-2 h-5 w-5" />
            Start Camera
          </Button>
          
          <Button 
            variant="link" 
            className="text-blue-400 mt-4 block mx-auto"
            onClick={(e) => {
              e.preventDefault();
              onFallback();
            }}
          >
            Use file upload instead
          </Button>
          
          {(isInIframe || isPrivateMode) && (
            <p className="mt-4 text-xs text-gray-400">
              {isInIframe 
                ? 'Camera access in embedded apps requires explicit permission.' 
                : 'Camera access in private browsing may be limited.'}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-full max-h-[70vh] bg-black">
        {/* iOS Safari fix: Add a background color div */}
        {isIOS && (
          <div 
            className="absolute inset-0 bg-black" 
            style={{ zIndex: 0 }}
          />
        )}
        
        <video 
          ref={handleVideoRef}
          autoPlay 
          playsInline 
          webkit-playsinline="true"
          muted // Important for iOS Safari autoplay
          className="w-full h-full"
          style={{ 
            objectFit: isAndroid ? 'cover' : 'contain',
            transform: isAndroid && window.orientation !== 0 
              ? 'rotate(90deg) translateZ(0)' 
              : isIOS || isAndroid
                ? 'translateZ(0)' // Force hardware acceleration on mobile
                : 'none',
            WebkitTransform: isIOS || isAndroid ? 'translateZ(0)' : 'none',
            backfaceVisibility: isIOS || isAndroid ? 'hidden' : 'visible',
            WebkitBackfaceVisibility: isIOS || isAndroid ? 'hidden' : 'visible',
            display: 'block', // Ensure video is visible
            backgroundColor: '#000', // Black background for better visibility
            position: 'relative',
            zIndex: 1,
            opacity: 1
          }}
          onError={(e) => {
            logger.error('[Camera] Video element error:', e);
            if (initializationAttempts > 1) {
              onFallback();
            }
          }}
        />
        
        {/* Mobile browsers fix: Add a transparent overlay to force hardware acceleration */}
        {(isIOS || isAndroid) && (
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              zIndex: 2,
              transform: 'translateZ(0)', // Force hardware acceleration
              WebkitTransform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitPerspective: 1000
            }}
          />
        )}
      </div>
      
      {isCapturing && !cameraReady && isInitializing && (
        <LoadingIndicator 
          isIOS={isIOS}
          initializationAttempts={initializationAttempts}
          isInIframe={isInIframe}
          isPrivateMode={isPrivateMode}
          onFallback={onFallback}
        />
      )}
      
      {isCapturing && cameraReady && (
        <ScanningOverlay />
      )}
    </>
  );
};

export default CameraView;
