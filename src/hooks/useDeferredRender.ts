import { useState, useEffect } from 'react';

/**
 * Hook to delay rendering a component until a specified amount of time has passed.
 * Useful for preventing flickering UI states during quick data fetches.
 * 
 * @param id Unique identifier for this deferred render
 * @param delay Delay in milliseconds before returning true
 * @returns boolean indicating whether the component should be rendered
 */
export const useDeferredRender = (id: string, delay: number = 500): boolean => {
  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    // Set up the delay timer
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);
    
    // Clean up on unmount
    return () => clearTimeout(timer);
  }, [delay, id]); // Include id to reset timer if id changes
  
  return shouldRender;
};

export default useDeferredRender;
