
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  initPostHog,
  identifyUser,
  resetIdentity,
  trackPageView,
  trackEvent,
  isFeatureEnabled,
  getFeatureFlagVariant,
} from "@/integrations/posthog/client";
import { ENABLE_ANALYTICS } from "@/config/env";
import { AUTH_EVENTS, ENGAGEMENT_EVENTS, PLATFORM_EVENTS } from "@/utils/analytics-events";
import logger from "@/utils/logger";

// Define the context type
type AnalyticsContextType = {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  isFeatureEnabled: (flagName: string, defaultValue?: boolean) => boolean;
  getFeatureFlagVariant: (flagName: string, defaultValue?: string) => string;
};

// Create context with default values
const AnalyticsContext = createContext<AnalyticsContextType>({
  trackEvent: () => {},
  isFeatureEnabled: () => false,
  getFeatureFlagVariant: () => "",
});

// Hook to use analytics context
export const useAnalytics = () => useContext(AnalyticsContext);

// Provider component
// Helper function to detect platform/device
const usePlatform = () => {
  const [platform, setPlatform] = useState({
    isAndroid: false,
    isIOS: false,
    isMobile: false,
    isSamsung: false,
    isChrome: false,
    deviceType: 'unknown',
    browserName: 'unknown'
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPad|iPhone|iPod/i.test(ua);
    const isMobile = isAndroid || isIOS || /Mobile/i.test(ua) || window.innerWidth < 768;
    const isSamsung = /SamsungBrowser/i.test(ua);
    const isChrome = /Chrome/i.test(ua) && !isSamsung;
    
    let browserName = 'unknown';
    if (isChrome) browserName = 'chrome';
    else if (isSamsung) browserName = 'samsung';
    else if (/Firefox/i.test(ua)) browserName = 'firefox';
    else if (/Safari/i.test(ua)) browserName = 'safari';
    else if (/Edge|Edg/i.test(ua)) browserName = 'edge';
    
    setPlatform({
      isAndroid,
      isIOS,
      isMobile,
      isSamsung,
      isChrome,
      deviceType: isMobile ? 'mobile' : 'desktop',
      browserName
    });
  }, []);

  return platform;
};

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const platform = usePlatform();
  
  // Refs for session tracking
  const sessionStartTime = useRef<number | null>(null);
  const previousUser = useRef<any | null>(null);
  const pageEntryTime = useRef<number | null>(null);

  // Initialize PostHog on first render if analytics are enabled
  useEffect(() => {
    if (ENABLE_ANALYTICS) {
      initPostHog();
    }
  }, []);

  // Track page views and time on page when location changes
  useEffect(() => {
    if (ENABLE_ANALYTICS) {
      const { pathname } = location;
      const currentTime = Date.now();

      // If we have a previous page entry time, calculate duration
      if (pageEntryTime.current) {
        const timeSpentMs = currentTime - pageEntryTime.current;
        
        // Enhanced tracking for page exit
        trackEvent(ENGAGEMENT_EVENTS.PAGE_EXIT, {
          path: pathname,
          timeSpentSeconds: Math.round(timeSpentMs / 1000),
          timeSpentMinutes: Math.round(timeSpentMs / 60000),
          // Add authentication status
          isAuthenticated: !!user,
          // Add user ID if authenticated
          ...(user ? { userId: user.id } : {}),
        });
      }
      
      // Document title may change after component mount, we capture what's available now
      const pageTitle = document.title;

      // Track page view with the pathname and title
      trackPageView(pathname, pageTitle);
      
      // Track page entry event
      trackEvent(ENGAGEMENT_EVENTS.PAGE_ENTRY, {
        path: pathname,
        referrer: document.referrer,
        deviceType: platform.deviceType,
        browserName: platform.browserName,
        isAuthenticated: !!user
      });
      
      // Reset entry time for new page
      pageEntryTime.current = currentTime;
    }
  }, [location, user, platform]);

  // Platform tracking
  useEffect(() => {
    if (ENABLE_ANALYTICS && user) {
      // Set user properties for platform segmentation
      identifyUser(user.id, {
        platform: platform.isAndroid ? 'android' : platform.isIOS ? 'ios' : 'desktop',
        deviceType: platform.deviceType,
        browser: platform.browserName
      });
      
      // Also capture as an event for immediate analysis
      trackEvent(PLATFORM_EVENTS.PLATFORM_IDENTIFIED, {
        platform: platform.isAndroid ? 'android' : platform.isIOS ? 'ios' : 'desktop',
        deviceType: platform.deviceType,
        browser: platform.browserName,
        screenSize: `${window.innerWidth}x${window.innerHeight}`
      });
    }
  }, [user, platform]);

  // Track authenticated session start/end
  useEffect(() => {
    if (ENABLE_ANALYTICS) {
      if (user && (!previousUser.current || previousUser.current?.id !== user.id)) {
        // Track session start
        trackEvent(AUTH_EVENTS.SESSION_STARTED, {
          userId: user.id,
          userRole: user.user_metadata?.role || 'standard',
          platform: platform.isAndroid ? 'android' : platform.isIOS ? 'ios' : 'desktop',
          browser: platform.browserName,
          deviceType: platform.deviceType
        });
        
        // Start session timer
        sessionStartTime.current = Date.now();
        previousUser.current = user;
      }
      
      // Return cleanup function to track session end
      return () => {
        if (user && sessionStartTime.current) {
          const sessionDuration = Date.now() - sessionStartTime.current;
          trackEvent(AUTH_EVENTS.SESSION_ENDED, {
            userId: user.id,
            durationSeconds: Math.round(sessionDuration / 1000),
            durationMinutes: Math.round(sessionDuration / 60000),
            platform: platform.isAndroid ? 'android' : platform.isIOS ? 'ios' : 'desktop'
          });
        }
      };
    }
  }, [user, platform]);

  // Identify user when auth state changes
  useEffect(() => {
    if (!ENABLE_ANALYTICS) return;

    if (user) {
      // Identify the user with their Supabase ID and available metadata
      identifyUser(user.id, {
        email: user.email,
        name: user.email?.split("@")[0] || "Unknown User",
        // Add platform information
        platform: platform.isAndroid ? 'android' : platform.isIOS ? 'ios' : 'desktop',
        deviceType: platform.deviceType,
        browser: platform.browserName
      });
    } else {
      // Reset identity on logout
      resetIdentity();
    }
  }, [user, platform]);

  // Value for the context provider
  const contextValue: AnalyticsContextType = {
    trackEvent,
    isFeatureEnabled,
    getFeatureFlagVariant,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
