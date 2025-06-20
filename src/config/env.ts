/**
 * Environment configuration module
 * Centralizes access to environment variables with fallbacks and validation
 */
import logger from '@/utils/logger';

// Enhanced debugging for production environment issues
const DEBUG_ENV = false;
const envDebug = (message: string, data?: any) => {
  if (DEBUG_ENV) {
    logger.info(`[ENV DEBUG] ${message}`, data || "");
  }
};

// Output all available environment variables for debugging
if (DEBUG_ENV) {
  envDebug("Build mode:", import.meta.env.MODE);
  envDebug("NODE_ENV:", import.meta.env.NODE_ENV);
  envDebug("Available env vars:", Object.keys(import.meta.env).join(", "));

  // Check if critical variables exist
  envDebug("VITE_APP_ENV exists:", !!import.meta.env.VITE_APP_ENV);
  envDebug("VITE_SUPABASE_URL exists:", !!import.meta.env.VITE_SUPABASE_URL);
  envDebug(
    "VITE_SUPABASE_ANON_KEY exists:",
    !!import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  // Stripe references removed
}

// Helper function to get environment variables with validation
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];

  if (DEBUG_ENV) {
    envDebug(
      `Getting ${key}:`,
      value !== undefined ? `Found (${value.substring(0, 8)}...)` : "NOT FOUND"
    );
  }

  if (value === undefined) {
    if (defaultValue !== undefined) {
      envDebug(
        `Using default for ${key}:`,
        defaultValue.substring(0, 8) + "..."
      );
      return defaultValue;
    }
    logger.error(`Required environment variable ${key} is missing`);
    return "";
  }

  return value as string;
};

// App environment
const vercelEnv = import.meta.env.VERCEL_ENV;
const isVercel =
  import.meta.env.VERCEL === "true" || import.meta.env.VERCEL === true;
const nodeEnv = import.meta.env.NODE_ENV;

// Detect if we're in a Vercel preview deployment
// Note: This might not be reliable in Vercel previews, as they use production build settings
// URL-based detection in client.ts provides a more reliable detection method
const isVercelPreview =
  vercelEnv === "preview" || (isVercel && nodeEnv !== "production");

export const APP_ENV = isVercelPreview
  ? "preview"
  : getEnvVar("VITE_APP_ENV", "development");
export const IS_DEV = APP_ENV === "development";
export const IS_PROD = APP_ENV === "production";
export const IS_TEST = APP_ENV === "test";
export const IS_PREVIEW = APP_ENV === "preview";

// Debug current environment detection
envDebug("Detected environment:", APP_ENV);
envDebug("IS_PROD:", IS_PROD);
envDebug("IS_TEST:", IS_TEST);
envDebug("IS_DEV:", IS_DEV);

// Supabase configuration
// IMPORTANT: We don't store actual credentials in source code
// The placeholder URLs and keys below are only used if environment variables are missing
// which should never happen in a properly configured environment

// Supabase URL - should come from environment variables
export const SUPABASE_URL = getEnvVar(
  "VITE_SUPABASE_URL",
  IS_PROD
    ? "MISSING_PRODUCTION_URL" // This will trigger an obvious error if env vars are missing
    : "http://localhost:54321" // Local Supabase default for development
);

// Supabase anon key - should come from environment variables
export const SUPABASE_ANON_KEY = getEnvVar(
  "VITE_SUPABASE_ANON_KEY",
  IS_PROD
    ? "MISSING_PRODUCTION_KEY" // This will trigger an obvious error if env vars are missing
    : "MISSING_LOCAL_DEV_KEY" // Safe placeholder for local development
);

// Supabase Edge Functions base URL
export const SUPABASE_FUNCTIONS_URL = getEnvVar(
  "VITE_SUPABASE_FUNCTIONS_URL",
  IS_PROD
    ? `${SUPABASE_URL}/functions/v1` // Derive from URL if in production
    : "http://localhost:54321/functions/v1" // Local development URL
);

// Stripe configuration removed - now a free product

// Feature flags
export const ENABLE_ANALYTICS =
  getEnvVar("VITE_ENABLE_ANALYTICS", "false") === "true";

// PostHog Analytics
export const POSTHOG_API_KEY = import.meta.env.VITE_POSTHOG_API_KEY as string;
export const POSTHOG_API_HOST = import.meta.env.VITE_POSTHOG_API_HOST as string;

// Log final configuration status
envDebug("FINAL CONFIG CHECK");
envDebug("Using SUPABASE_URL:", SUPABASE_URL);
if (SUPABASE_URL.includes("yyqodsrvslheazteialw")) {
  envDebug("WARNING: USING TEST SUPABASE PROJECT IN CURRENT ENVIRONMENT");
}
if (SUPABASE_URL.includes("nmzqcbyuqxyhnnafpyil")) {
  envDebug("USING PRODUCTION SUPABASE PROJECT");
}

// Check if we're using placeholder values in production
if (IS_PROD) {
  if (SUPABASE_URL === "MISSING_PRODUCTION_URL") {
    logger.error(
      "ERROR: Production Supabase URL is missing from environment variables"
    );
  }
  if (SUPABASE_ANON_KEY === "MISSING_PRODUCTION_KEY") {
    logger.error(
      "ERROR: Production Supabase anon key is missing from environment variables"
    );
  }
  // Stripe validation removed
}

// Stripe debug logging removed

// Log environment configuration in development
if (IS_DEV) {
  logger.info("Environment configuration loaded:", {
    APP_ENV,
    IS_DEV,
    IS_PROD,
    IS_TEST,
    SUPABASE_URL,
    SUPABASE_ANON_KEY: SUPABASE_ANON_KEY.substring(0, 8) + "...",
    SUPABASE_FUNCTIONS_URL,
    // Stripe environment variables removed
    ENABLE_ANALYTICS,
    POSTHOG_API_KEY,
    POSTHOG_API_HOST,
  });
}
