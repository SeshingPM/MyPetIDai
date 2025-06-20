import React, { createContext, useContext, useEffect, useState } from 'react';
import logger from '@/utils/logger';

interface PlatformContextType {
  isAndroid: boolean;
  isIOS: boolean;
  isMobile: boolean;
  isSamsung: boolean;
  isChrome: boolean;
  showDocumentScanner: boolean; // Whether document scanning should be available on this platform
}

const defaultContext: PlatformContextType = {
  isAndroid: false,
  isIOS: false,
  isMobile: false,
  isSamsung: false,
  isChrome: false,
  showDocumentScanner: true // Default to true, will be updated based on platform detection
};

const PlatformContext = createContext<PlatformContextType>(defaultContext);

export const usePlatform = () => useContext(PlatformContext);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [platformInfo, setPlatformInfo] = useState<PlatformContextType>(defaultContext);

  useEffect(() => {
    // Detect platform on mount
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Detect mobile platforms with more reliable checks
      const isAndroid = /android/i.test(userAgent);
      
      // Enhanced iOS detection that works in private browsing mode
      const isIOS = Boolean(
        /iphone|ipad|ipod/i.test(userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.userAgent.includes("Mac") && "ontouchend" in document)
      );
      
      // Detect browsers
      const isSamsung = /samsungbrowser/i.test(userAgent);
      const isChrome = /chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent);
      
      // Combined mobile detection
      const isMobile = isAndroid || isIOS || /mobile|tablet/i.test(userAgent);
      
      // Log platform detection results
      logger.info('[PlatformContext] Platform detection completed', { 
        isAndroid, 
        isIOS, 
        isMobile,
        isSamsung,
        isChrome 
      });
      
      // Document scanning should only be available on desktop, not iOS or mobile
      const showDocumentScanner = !isIOS && !isMobile;
      
      setPlatformInfo({
        isAndroid,
        isIOS,
        isMobile,
        isSamsung,
        isChrome,
        showDocumentScanner
      });
    };
    
    detectPlatform();
  }, []);

  return (
    <PlatformContext.Provider value={platformInfo}>
      {children}
    </PlatformContext.Provider>
  );
};

export default PlatformProvider;
