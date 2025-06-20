/**
 * Type-safe environment variable management
 * 
 * This utility provides a centralized and type-safe way to access
 * environment variables, reducing the risk of undocumented/insecure access
 */

// Simple logger implementation since @/hooks/useLogger can't be found
const useLogger = (context: string) => ({
  error: (message: string) => console.error(`[${context}] ${message}`),
  warn: (message: string) => console.warn(`[${context}] ${message}`),
  info: (message: string) => console.info(`[${context}] ${message}`),
});

/**
 * Interface for application environment variables
 * This provides type safety and documentation for all env vars
 */
export interface EnvVars {
  // API Keys (never directly expose these in client-side code)

  
  // Client-side exposed variables (safe to expose)
  VITE_POSTHOG_API_KEY: string;
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  
  // Configuration values
  FRONTEND_URL: string;
  NODE_ENV: 'development' | 'test' | 'production';
}

/**
 * Gets an environment variable in a type-safe way
 * 
 * @param key The environment variable name
 * @param required Whether the variable is required
 * @param defaultValue Optional default value if not found
 * @returns The environment variable value
 * @throws Error if the variable is required but not found
 */
export function getEnvVar<K extends keyof EnvVars>(
  key: K, 
  required = true,
  defaultValue?: EnvVars[K]
): EnvVars[K] {
  const logger = useLogger('env');
  
  // Get the value from the appropriate source based on environment
  let value: string | undefined;
  
  if (typeof window !== 'undefined') {
    // Browser environment - only access VITE_ prefixed variables
    if (key.startsWith('VITE_')) {
      // Fix for ImportMeta.env type issue
      value = ((import.meta as any).env?.[key] as string) || undefined;
    } else {
      logger.warn(`Attempted to access server-side env var ${key} from client`);
      return defaultValue as EnvVars[K];
    }
  } else {
    // Server environment
    // Fix for process not found
    value = (typeof process !== 'undefined' ? process.env?.[key] : undefined) || undefined;
  }
  
  // Handle required variables
  if (!value && required && defaultValue === undefined) {
    const errorMessage = `Missing required environment variable: ${key}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  return (value || defaultValue) as EnvVars[K];
}

/**
 * Validate critical environment variables on application startup
 * This helps catch missing variables early
 */
export function validateEnv(): boolean {
  const logger = useLogger('env');
  const requiredVars: (keyof EnvVars)[] = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  let isValid = true;
  
  // Check each required variable
  for (const varName of requiredVars) {
    try {
      getEnvVar(varName);
    } catch (error) {
      isValid = false;
      logger.error(`Environment validation failed: ${error.message}`);
    }
  }
  
  return isValid;
}

/**
 * Safe wrapper for accessing environment in client components
 * Only allows access to VITE_ prefixed variables that are safe to expose
 */
export function useClientEnv<K extends keyof EnvVars>(key: K): EnvVars[K] | undefined {
  if (!key.toString().startsWith('VITE_')) {
    console.error(`Security warning: Attempted to access non-VITE_ env var "${key}" in client code`);
    return undefined;
  }
  
  return getEnvVar(key, false);
}
