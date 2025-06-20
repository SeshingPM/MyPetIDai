
import { useState, useEffect, useRef } from 'react';

/**
 * Session storage key for tracking components that have already been rendered
 */
const RENDERED_COMPONENTS_KEY = 'petdocument_rendered_components';

/**
 * Get the list of component IDs that have already been rendered in this session
 */
const getRenderedComponents = (): string[] => {
  try {
    const stored = sessionStorage.getItem(RENDERED_COMPONENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

/**
 * Mark a component as rendered in this session
 */
const markComponentAsRendered = (id: string): void => {
  try {
    const components = getRenderedComponents();
    if (!components.includes(id)) {
      components.push(id);
      sessionStorage.setItem(RENDERED_COMPONENTS_KEY, JSON.stringify(components));
    }
  } catch (e) {
    // Ignore errors with sessionStorage
  }
};

/**
 * Custom hook that intelligently defers rendering of components to prevent UI from freezing
 * and reduce unnecessary loading indicators when navigating between routes or tabs
 * 
 * @param componentId - Unique identifier for the component (used for caching render state)
 * @param initialDelay - Time in ms to defer initial rendering (default: 50ms)
 * @param subsequentDelay - Time in ms to defer subsequent renderings (default: 0ms - immediate)
 * @param dependencies - Array of dependencies that should trigger a re-evaluation
 * @returns shouldRender - Whether the component should render
 */
export const useDeferredRender = (
  componentId: string,
  initialDelay = 50,
  subsequentDelay = 0,
  dependencies: any[] = []
) => {
  const [shouldRender, setShouldRender] = useState(false);
  const hasRenderedBefore = useRef(getRenderedComponents().includes(componentId));
  
  useEffect(() => {
    // Reset to false on each re-run of the effect
    setShouldRender(false);
    
    // Determine which delay to use based on whether this component has rendered before
    const delay = hasRenderedBefore.current ? subsequentDelay : initialDelay;
    
    // If no delay for subsequent renders, render immediately
    if (hasRenderedBefore.current && subsequentDelay === 0) {
      setShouldRender(true);
      return;
    }
    
    // Schedule the render after the appropriate delay
    const timer = setTimeout(() => {
      setShouldRender(true);
      
      // Mark this component as having been rendered
      if (!hasRenderedBefore.current) {
        hasRenderedBefore.current = true;
        markComponentAsRendered(componentId);
      }
    }, delay);
    
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentId, initialDelay, subsequentDelay, ...dependencies]);
  
  return shouldRender;
};

export default useDeferredRender;
