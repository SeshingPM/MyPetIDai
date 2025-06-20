/**
 * Utility functions for device detection
 */

/**
 * Check if the current device is a mobile device
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Check if the current device is running iOS
 */
export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Modern way to detect iOS without using the deprecated MSStream property
  const userAgent = navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(userAgent) && 
         !(/Windows Phone|Android/i.test(userAgent));
};

/**
 * Check if the current device is running Android
 */
export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android/i.test(navigator.userAgent);
};

/**
 * Check if the current device is a desktop device
 */
export const isDesktop = (): boolean => {
  return !isMobile();
};

export default {
  isMobile,
  isIOS,
  isAndroid,
  isDesktop
};
