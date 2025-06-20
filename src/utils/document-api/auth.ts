import { supabase } from '@/integrations/supabase/client';
import logger from '@/utils/logger';

/**
 * Ensures the session is fresh before performing document operations
 * Returns true if session is valid, false otherwise
 */
export const ensureFreshSession = async (): Promise<boolean> => {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      logger.warn('No active session found when attempting document operation');
      return false;
    }
    
    // Check if token is about to expire (within 5 minutes)
    const expiresAt = session.expires_at;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const fiveMinutesInSeconds = 5 * 60;
    
    if (expiresAt && expiresAt - nowInSeconds < fiveMinutesInSeconds) {
      logger.info('Session token nearing expiration, refreshing...');
      
      // Explicitly refresh the token
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        logger.error('Failed to refresh session:', refreshError);
        return false;
      }
      
      logger.info('Session refreshed successfully');
      return !!refreshData.session;
    }
    
    // Session is valid and not about to expire
    return true;
  } catch (error) {
    logger.error('Error ensuring fresh session:', error);
    return false;
  }
};
