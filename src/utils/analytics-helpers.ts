import { trackEvent } from "@/integrations/posthog/client";
import { useAuth } from "@/contexts/AuthContext";
import { DASHBOARD_EVENTS, ENGAGEMENT_EVENTS } from "@/utils/analytics-events";
import logger from "@/utils/logger";
import { ENABLE_ANALYTICS } from "@/config/env";

/**
 * Track feature usage by authenticated users
 */
export const trackFeatureUsage = (
  featureName: string,
  actionType: "view" | "interact" | "complete",
  metadata?: Record<string, any>
): void => {
  if (!ENABLE_ANALYTICS) return;

  try {
    const user = useAuth().user;
    
    if (!user) return;
    
    trackEvent(DASHBOARD_EVENTS.FEATURE_USED, {
      userId: user.id,
      feature: featureName,
      action: actionType,
      // All features are now free
      userType: "standard",
      timestamp: new Date().toISOString(),
      ...metadata
    });
  } catch (error) {
    logger.error("[Analytics] Error tracking feature usage:", error);
  }
};

/**
 * Track document interactions in the dashboard
 */
export const trackDocumentAction = (
  documentId: string,
  action: "view" | "download" | "share" | "delete" | "rename" | "favorite",
  metadata?: Record<string, any>
): void => {
  if (!ENABLE_ANALYTICS) return;

  try {
    const user = useAuth().user;
    
    if (!user) return;
    
    trackEvent(DASHBOARD_EVENTS.DOCUMENT_ACTION, {
      userId: user.id,
      documentId,
      action,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  } catch (error) {
    logger.error("[Analytics] Error tracking document action:", error);
  }
};

/**
 * Track pet-related interactions in the dashboard
 */
export const trackPetAction = (
  petId: string,
  action: "view" | "edit" | "delete" | "add_record",
  metadata?: Record<string, any>
): void => {
  if (!ENABLE_ANALYTICS) return;

  try {
    const user = useAuth().user;
    
    if (!user) return;
    
    trackEvent(DASHBOARD_EVENTS.PET_ACTION, {
      userId: user.id,
      petId,
      action,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  } catch (error) {
    logger.error("[Analytics] Error tracking pet action:", error);
  }
};

/**
 * Track dashboard tab changes
 */
export const trackDashboardTabChange = (
  tabName: string,
  previousTab: string | null
): void => {
  if (!ENABLE_ANALYTICS) return;

  try {
    const user = useAuth().user;
    
    if (!user) return;
    
    trackEvent(DASHBOARD_EVENTS.TAB_CHANGED, {
      userId: user.id,
      tabName,
      previousTab: previousTab || "unknown",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error("[Analytics] Error tracking tab change:", error);
  }
};

/**
 * Track settings changes
 */
export const trackSettingsChange = (
  settingName: string,
  newValue: any,
  previousValue: any
): void => {
  if (!ENABLE_ANALYTICS) return;

  try {
    const user = useAuth().user;
    
    if (!user) return;
    
    trackEvent(DASHBOARD_EVENTS.SETTINGS_CHANGED, {
      userId: user.id,
      setting: settingName,
      timestamp: new Date().toISOString(),
      // Don't track actual values for privacy, just that a change occurred
      changed: true
    });
  } catch (error) {
    logger.error("[Analytics] Error tracking settings change:", error);
  }
};

/**
 * Set up click tracking for dashboard elements
 * This should be called once when the dashboard is initialized
 */
export const setupDashboardClickTracking = (): (() => void) => {
  if (!ENABLE_ANALYTICS) return () => {};
  
  const user = useAuth().user;
  
  if (!user) return () => {};
  
  // Track clicks on important dashboard elements
  const handleClick = (event: MouseEvent) => {
    // Get the clicked element
    const element = event.target as HTMLElement;
    
    // Check if it has a data-track attribute
    const trackId = element.getAttribute("data-track-id");
    
    if (trackId) {
      trackEvent("element_clicked", {
        userId: user.id,
        elementId: trackId,
        path: window.location.pathname,
        elementText: element.textContent?.trim().substring(0, 50) || "",
        timestamp: new Date().toISOString()
      });
    }
  };
  
  document.addEventListener("click", handleClick);
  
  // Return cleanup function
  return () => {
    document.removeEventListener("click", handleClick);
  };
};

/**
 * Track rage clicks to detect user frustration
 * Call this function once to set up the tracking
 */
export const setupRageClickDetection = (): (() => void) => {
  if (!ENABLE_ANALYTICS) return () => {};
  
  const user = useAuth().user;
  
  if (!user) return () => {};
  
  let clicks: { x: number; y: number; time: number }[] = [];
  const RAGE_THRESHOLD = 3; // Number of clicks in the same area within a short time
  const TIME_WINDOW = 2000; // Time window in milliseconds
  const PROXIMITY = 30; // Pixel proximity to consider clicks in the same area
  
  const handleClick = (event: MouseEvent) => {
    const newClick = { 
      x: event.clientX, 
      y: event.clientY, 
      time: Date.now() 
    };
    
    // Clean up old clicks outside the time window
    clicks = clicks.filter(click => newClick.time - click.time < TIME_WINDOW);
    
    // Add the new click
    clicks.push(newClick);
    
    // Check if there are enough clicks in the same area to consider it a rage click
    const proximityClicks = clicks.filter(click => 
      Math.abs(click.x - newClick.x) < PROXIMITY && 
      Math.abs(click.y - newClick.y) < PROXIMITY
    );
    
    if (proximityClicks.length >= RAGE_THRESHOLD) {
      // Detect rage click
      trackEvent(ENGAGEMENT_EVENTS.RAGE_CLICK, {
        userId: user.id,
        path: window.location.pathname,
        clickCount: proximityClicks.length,
        element: (event.target as HTMLElement).tagName,
        elementId: (event.target as HTMLElement).id || undefined,
        elementClass: (event.target as HTMLElement).className || undefined,
        timestamp: new Date().toISOString()
      });
      
      // Reset clicks after tracking rage click
      clicks = [];
    }
  };
  
  document.addEventListener("click", handleClick);
  
  // Return cleanup function
  return () => {
    document.removeEventListener("click", handleClick);
  };
};

/**
 * Track form abandonment
 * Call this function with a form element to track abandonment
 */
export const trackFormAbandonment = (
  formElement: HTMLFormElement,
  formName: string
): (() => void) => {
  if (!ENABLE_ANALYTICS) return () => {};
  
  const user = useAuth().user;
  
  if (!user || !formElement) return () => {};
  
  let formStarted = false;
  let inputCount = 0;
  
  // Track when the user starts interacting with the form
  const handleInteraction = () => {
    if (!formStarted) {
      formStarted = true;
      inputCount = 0;
    }
    inputCount++;
  };
  
  // Track when the user submits the form
  const handleSubmit = () => {
    formStarted = false;
    inputCount = 0;
  };
  
  // Track when the user navigates away without submitting
  const handleUnload = () => {
    if (formStarted) {
      trackEvent(ENGAGEMENT_EVENTS.FORM_ABANDONED, {
        userId: user.id,
        formName,
        inputCount,
        path: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  // Add event listeners
  formElement.addEventListener("input", handleInteraction);
  formElement.addEventListener("submit", handleSubmit);
  window.addEventListener("beforeunload", handleUnload);
  
  // Return cleanup function
  return () => {
    formElement.removeEventListener("input", handleInteraction);
    formElement.removeEventListener("submit", handleSubmit);
    window.removeEventListener("beforeunload", handleUnload);
  };
};
