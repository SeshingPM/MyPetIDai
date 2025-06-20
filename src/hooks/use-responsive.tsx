
import { useState, useEffect, useCallback } from "react";

// Define breakpoints following Tailwind's convention
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

type Breakpoint = keyof typeof breakpoints;

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const [isAboveBreakpoint, setIsAboveBreakpoint] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth >= breakpoints[breakpoint] : false
  );

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsAboveBreakpoint(window.innerWidth >= breakpoints[breakpoint]);
    };
    
    // Check immediately on mount
    checkBreakpoint();
    
    // Debounced resize handler
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(checkBreakpoint, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isAboveBreakpoint;
}

export function useIsMobile(): boolean {
  return !useBreakpoint('md');
}

export function useIsTablet(): boolean {
  const isAboveMd = useBreakpoint('md');
  const isBelowLg = !useBreakpoint('lg');
  return isAboveMd && isBelowLg;
}

export function useIsDesktop(): boolean {
  return useBreakpoint('lg');
}

export function useOrientationChange(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    typeof window !== 'undefined' 
      ? window.matchMedia("(orientation: portrait)").matches ? 'portrait' : 'landscape'
      : 'portrait'
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.matchMedia("(orientation: portrait)").matches ? 'portrait' : 'landscape');
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return orientation;
}

export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(false);
  
  useEffect(() => {
    const checkTouchDevice = () => {
      return 'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;
    };
    
    setIsTouch(checkTouchDevice());
  }, []);
  
  return isTouch;
}

export function usePreferReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
