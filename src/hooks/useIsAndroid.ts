import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is Android
 * This is safe to use in server-side rendering as it defaults to false
 */
export const useIsAndroid = (): boolean => {
  const [isAndroid, setIsAndroid] = useState(false);
  
  useEffect(() => {
    // Only run on client-side
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      const isAndroidDevice = /android/i.test(userAgent);
      const hasAndroidParam = typeof window !== 'undefined' && 
        window.location.search.includes('android=true');
      
      setIsAndroid(isAndroidDevice || hasAndroidParam);
      
      // Debug log
      if (isAndroidDevice || hasAndroidParam) {
        console.log('[PlatformDetection] Android device detected');
      }
    }
  }, []);
  
  return isAndroid;
};

/**
 * Helper function to detect Android without hooks
 * Safe to use anywhere including outside of components
 */
export const isAndroidDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = /android/i.test(userAgent);
  const hasAndroidParam = typeof window !== 'undefined' && window.location.search.includes('android=true');
  
  return isAndroid || hasAndroidParam;
};

export default useIsAndroid;
