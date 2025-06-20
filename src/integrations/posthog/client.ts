import posthog from "posthog-js";
import { IS_DEV, POSTHOG_API_KEY, POSTHOG_API_HOST } from "@/config/env";
import logger from "@/utils/logger";

/**
 * Initialize PostHog analytics
 * This should be called as early as possible in your app
 */
export const initPostHog = (): void => {
  if (!POSTHOG_API_KEY) {
    logger.warn(
      "PostHog API key is not set. Analytics will not be initialized."
    );
    return;
  }

  // Initialize PostHog with enhanced configuration
  posthog.init(POSTHOG_API_KEY, {
    api_host: POSTHOG_API_HOST || "https://app.posthog.com",
    capture_pageview: false, // We'll handle pageviews with react-router
    autocapture: true, // Automatically capture clicks, form submissions, etc.
    persistence: "localStorage",
    mask_all_text: false, // Only mask sensitive input fields
    mask_all_element_attributes: false,
    disable_cookie: false,
    // Enhanced functionality
    capture_pageleave: true,
    disable_session_recording: false,
    loaded: (posthog) => {
      // Turn off analytics in development to avoid polluting data
      if (IS_DEV) {
        posthog.opt_out_capturing();
      }
      
      // Enable session recording via property setting
      // This approach avoids TypeScript issues with the direct configuration
      // @ts-ignore - Setting advanced properties not in the type definition
      posthog.set_config({ session_recording: true });
      // @ts-ignore - Setting advanced properties not in the type definition
      posthog.set_config({ mask_all_inputs: true });
      
      // Additional advanced configs that might not be in the type definition
      // Applied after initialization to avoid type errors
      const advancedConfigs = {
        capture_form_submit: true,
        rageclick: true
      };
      
      // Apply the advanced configs
      Object.entries(advancedConfigs).forEach(([key, value]) => {
        // @ts-ignore - Applying configs that might not be in the type definition
        posthog.config[key] = value;
      });
    },
  });
};

/**
 * Identify a user by their Supabase ID and metadata
 * Call this after login/signup when you have user data
 */
export const identifyUser = (
  userId: string,
  metadata?: {
    email?: string;
    name?: string;
    isPremium?: boolean;
    signUpDate?: string;
    [key: string]: any;
  }
): void => {
  if (!userId) return;

  // Set user identity
  posthog.identify(userId, {
    ...metadata,
    $set: {
      isPremium: metadata?.isPremium || false,
      signUpDate: metadata?.signUpDate,
    },
  });
};

/**
 * Reset user identification on logout
 */
export const resetIdentity = (): void => {
  posthog.reset();
};

/**
 * Track a custom event with enhanced error handling
 */
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
): void => {
  try {
    posthog.capture(eventName, properties);
    if (IS_DEV) {
      logger.devOnly(`[Analytics] Tracked: ${eventName}`, properties);
    }
  } catch (error) {
    logger.error(`[Analytics] Error tracking event: ${eventName}`, error);
  }
};

/**
 * Track a page view
 */
export const trackPageView = (
  pathname: string,
  pageTitle?: string,
  properties?: Record<string, any>
): void => {
  posthog.capture("$pageview", {
    $current_url: pathname,
    page_title: pageTitle,
    ...properties,
  });
};

/**
 * Check if a feature flag is enabled
 */
export const isFeatureEnabled = (
  flagName: string,
  defaultValue: boolean = false
): boolean => {
  try {
    return posthog.isFeatureEnabled(flagName) ?? defaultValue;
  } catch (error) {
    logger.error(`Error checking feature flag ${flagName}:`, error);
    return defaultValue;
  }
};

/**
 * Get the variant for an A/B test
 */
export const getFeatureFlagVariant = (
  flagName: string,
  defaultValue: string = ""
): string => {
  return posthog.getFeatureFlag(flagName) as string || defaultValue;
};

// Export PostHog instance directly for advanced usage
export { posthog };
