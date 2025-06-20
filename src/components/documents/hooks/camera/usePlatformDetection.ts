import { useState, useEffect } from 'react';
import logger from '@/utils/logger';

interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isInIframe: boolean;
  isPrivateMode: boolean;
  requiresUserInteraction: boolean;
  browserSupport: {
    hasMediaDevices: boolean;
    hasAdvancedFeatures: boolean;
    hasWebAssembly: boolean;
    isSecureContext: boolean;
  };
}

export const usePlatformDetection = (): PlatformInfo => {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [requiresUserInteraction, setRequiresUserInteraction] = useState(false);
  const [browserSupport, setBrowserSupport] = useState({
    hasMediaDevices: false,
    hasAdvancedFeatures: false,
    hasWebAssembly: false,
    isSecureContext: false
  });

  useEffect(() => {
    const detectPlatform = async () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const detectedIOS = /iphone|ipad|ipod/.test(userAgent) || 
                          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const detectedAndroid = /android/.test(userAgent);
      const isMobile = detectedIOS || detectedAndroid || /mobile|tablet/.test(userAgent);
      
      // Check if running in an iframe
      const inIframe = window !== window.top;
      
      // Detect browsers
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
      const isChrome = /chrome/.test(userAgent) && !/edge|edg/.test(userAgent);
      const isSamsung = /samsungbrowser/.test(userAgent);
      const isFirefox = /firefox/.test(userAgent);
      const isEdge = /edge|edg/.test(userAgent);
      
      // Log browser details for debugging
      logger.info(`[Platform] Browser detection: Chrome: ${isChrome}, Safari: ${isSafari}, Firefox: ${isFirefox}, Edge: ${isEdge}, Samsung: ${isSamsung}`);
      
      // Force user interaction button for iOS Safari to improve reliability
      // Also for Samsung browser which has known camera issues
      if ((detectedIOS && (isSafari || inIframe)) || isSamsung) {
        setRequiresUserInteraction(true);
      }
      
      // For Chrome, check if we're in incognito mode which might affect camera access
      if (isChrome) {
        try {
          // A simple test to detect incognito mode in Chrome
          // Using any type assertion for non-standard browser APIs
          const fs = (window as any).RequestFileSystem || (window as any).webkitRequestFileSystem;
          const tempStorage = (window as any).TEMPORARY || 0;
          
          if (fs) {
            fs(tempStorage, 100, 
              () => logger.info('[Platform] Chrome is not in incognito mode'),
              () => {
                logger.info('[Platform] Chrome appears to be in incognito mode');
                setRequiresUserInteraction(true); // Require interaction for incognito Chrome
              }
            );
          }
        } catch (e) {
          logger.warn('[Platform] Error checking Chrome incognito mode:', e);
        }
      }
      
      setIsIOS(detectedIOS);
      setIsAndroid(detectedAndroid);
      setIsInIframe(inIframe);
      
      if (detectedIOS) {
        logger.info('[Platform] iOS device detected');
      }
      
      if (detectedAndroid) {
        logger.info('[Platform] Android device detected');
        logger.info(`[Platform] Android browser details: Chrome: ${isChrome}, Samsung: ${isSamsung}`);
      }
      
      // Check for camera support more thoroughly
      let hasMediaDevicesAPI = false;
      let hasGetUserMedia = false;
      
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
      logger.info(`[Platform] Current hostname: ${window.location.hostname}`);
      
      // Consider localhost, Vercel previews, and production domain as trusted environments
      const isTrustedEnvironment = isLocalhost || isVercelPreview || isProductionDomain;
      
      try {
        // Check if the API exists
        hasMediaDevicesAPI = !!(navigator.mediaDevices);
        
        // Check if getUserMedia exists
        hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        
        // On iOS, always assume camera might be available since iOS may report false
        // until permission is explicitly granted
        if (detectedIOS) {
          hasMediaDevicesAPI = true;
          hasGetUserMedia = true;
        }
        
        // Verify HTTPS for camera access
        const isSecure = window.isSecureContext;
        
        // Consider the context secure if it's either a secure context or a trusted environment
        const effectivelySecure = isSecure || isTrustedEnvironment;
        
        if (!effectivelySecure) {
          logger.warn('[Platform] Not in secure context, camera access may be restricted');
          // In non-secure contexts, camera access is often blocked
          hasMediaDevicesAPI = false;
          hasGetUserMedia = false;
        } else if (isTrustedEnvironment && !isSecure) {
          logger.info('[Platform] Running on trusted environment, treating as secure context for camera access');
        }
        
        logger.info(`[Platform] Media API detection: API exists: ${hasMediaDevicesAPI}, getUserMedia exists: ${hasGetUserMedia}, Secure context: ${effectivelySecure}`);
        
        // Additional check - try to enumerate devices to see if any video input devices exist
        if (hasMediaDevicesAPI && navigator.mediaDevices.enumerateDevices) {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasVideoInputs = devices.some(device => device.kind === 'videoinput');
            logger.info(`[Platform] Device enumeration: Video inputs available: ${hasVideoInputs}`);
            
            if (!hasVideoInputs) {
              logger.warn('[Platform] No video input devices detected');
              // Don't set hasMediaDevices to false here, as permission might not be granted yet
            }
          } catch (enumError) {
            logger.warn('[Platform] Error enumerating devices:', enumError);
            // Don't fail here, as this might just be a permission issue
          }
        }
      } catch (e) {
        logger.warn('[Platform] Error checking media devices:', e);
      }
      
      // Check for advanced features
      const hasAdvancedFeatures = 'ImageCapture' in window;
      const hasWebAssembly = typeof WebAssembly === 'object';
      
      // Use the same trusted environment check for secure context
      const isSecureContext = window.isSecureContext || isTrustedEnvironment;
      
      setBrowserSupport({
        hasMediaDevices: hasMediaDevicesAPI && hasGetUserMedia,
        hasAdvancedFeatures,
        hasWebAssembly,
        isSecureContext
      });
    };
    
    detectPlatform();
    
    // Detect private browsing mode in Safari
    const detectPrivateMode = async () => {
      if (isIOS) {
        try {
          // Safari in private mode has limited storage
          const storage = window.localStorage;
          const testKey = '__private_mode_test__';
          storage.setItem(testKey, testKey);
          storage.removeItem(testKey);
          
          // Check if iframe has camera permissions
          if (isInIframe) {
            try {
              // This will fail if iframe doesn't have allow="camera"
              await navigator.permissions.query({ name: 'camera' as PermissionName });
            } catch (e) {
              logger.warn('[Platform] Iframe may not have camera permissions:', e);
              setRequiresUserInteraction(true);
            }
          }
        } catch (e) {
          // Storage failed - likely private mode
          logger.warn('[Platform] Detected private browsing mode');
          setIsPrivateMode(true);
          setRequiresUserInteraction(true);
        }
      }
    };
    
    detectPrivateMode();
    
  }, []);

  return {
    isIOS,
    isAndroid,
    isMobile: isIOS || isAndroid,
    isInIframe,
    isPrivateMode,
    requiresUserInteraction,
    browserSupport,
  };
};

export default usePlatformDetection;
