import { supabase } from '@/integrations/supabase/client';
import { ensureFreshSession } from './auth';
import { toast } from 'sonner';
import logger from '@/utils/logger';

/**
 * Wrapper for document operations that ensures a fresh session
 * and handles JWT errors consistently
 */
export const withFreshSession = async <T>(
  operation: () => Promise<T>,
  options: {
    operationName: string;
    retryOnFailure?: boolean;
    showToasts?: boolean;
  }
): Promise<T | null> => {
  const { operationName, retryOnFailure = true, showToasts = true } = options;
  const requestId = Math.random().toString(36).substring(2, 9);
  
  try {
    // Ensure we have a fresh session before the operation
    const sessionValid = await ensureFreshSession();
    
    if (!sessionValid) {
      if (showToasts) {
        toast.error('Your session has expired. Please sign in again.');
      }
      
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = `/login?return_to=${encodeURIComponent(window.location.pathname)}`;
      }, 2000);
      
      return null;
    }
    
    // Perform the operation with the fresh session
    return await operation();
    
  } catch (error: any) {
    logger.error(`[${operationName} ${requestId}] Error:`, error);
    
    // Check for JWT or auth errors
    const errorMessage = error?.message || '';
    const isJwtError = errorMessage.toLowerCase().includes('jwt') || 
                       errorMessage.toLowerCase().includes('token') ||
                       errorMessage.includes('401');
    
    if (isJwtError && retryOnFailure) {
      logger.warn(`[${operationName} ${requestId}] JWT error detected, attempting retry`);
      
      try {
        // Try to refresh the session
        const { error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          logger.error(`[${operationName} ${requestId}] Failed to refresh session:`, refreshError);
          
          if (showToasts) {
            toast.error('Your session has expired. Please sign in again.');
          }
          
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = `/login?return_to=${encodeURIComponent(window.location.pathname)}`;
          }, 2000);
          
          return null;
        }
        
        // Session refreshed successfully, retry the operation
        logger.info(`[${operationName} ${requestId}] Session refreshed, retrying operation`);
        
        // Only retry once to avoid infinite loops
        return await withFreshSession(operation, {
          ...options,
          retryOnFailure: false
        });
      } catch (refreshError) {
        logger.error(`[${operationName} ${requestId}] Error during session refresh:`, refreshError);
        return null;
      }
    }
    
    // For non-JWT errors or after a retry failure
    if (showToasts) {
      toast.error(`Error: ${errorMessage || 'Something went wrong'}`);
    }
    
    return null;
  }
};
