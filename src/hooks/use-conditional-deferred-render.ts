import { useState, useEffect, useRef } from 'react';

/**
 * A hook that defers rendering until a specified delay has passed, but only starts
 * the timer when a specific condition is met. This prevents premature rendering
 * and ensures proper synchronization with data loading.
 * 
 * @param id Unique identifier for this deferred render
 * @param shouldStartTimer Condition that must be true to start the delay timer
 * @param delay Delay in milliseconds before returning true
 * @returns boolean indicating whether the component should be rendered
 */
export const useConditionalDeferredRender = (
  id: string,
  shouldStartTimer: boolean,
  delay: number = 500
): boolean => {
  const [shouldRender, setShouldRender] = useState(false);
  const timerStarted = useRef(false);
  
  useEffect(() => {
    // Only start the timer when the condition is met AND timer hasn't started yet
    if (shouldStartTimer && !timerStarted.current) {
      timerStarted.current = true;
      
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
    
    // Reset when condition becomes false again
    if (!shouldStartTimer) {
      timerStarted.current = false;
      setShouldRender(false);
    }
  }, [shouldStartTimer, delay, id]);
  
  return shouldRender;
};

export default useConditionalDeferredRender;
