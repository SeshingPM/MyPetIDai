import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import logger from '@/utils/logger';

/**
 * Hook to prevent automatic authentication during specific flows like password reset
 * This is used to prevent unintended cross-tab authentication
 */
export function usePreventAutoAuth() {
  useEffect(() => {
    // Instead of forcing sign out, we'll set a flag to indicate this tab should ignore auth events
    let shouldIgnoreAuthEvents = false;
    
    // Function to check if another tab has a password reset flow active
    const checkForPasswordResetFlow = () => {
      try {
        // Check if there's a password reset flow happening (cross-tab)
        const passwordResetInProgress = localStorage.getItem('password_reset_in_progress');
        if (passwordResetInProgress === 'true') {
          logger.info('Detected password reset flow in another tab');
          shouldIgnoreAuthEvents = true;
          
          // Set a local flag to prevent this tab from processing auth events
          // This is safer than force signing out
          localStorage.setItem('ignore_auth_events_in_this_tab', 'true');
          
          return true;
        }
        return false;
      } catch (error) {
        logger.error('Error checking for password reset flow:', error);
        return false;
      }
    };

    // Initial check - but don't force sign out immediately
    shouldIgnoreAuthEvents = checkForPasswordResetFlow();

    // Listen for storage changes that might indicate a password reset flow started
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'password_reset_in_progress' && event.newValue === 'true') {
        logger.info('Detected password reset flow started in another tab');
        shouldIgnoreAuthEvents = true;
        localStorage.setItem('ignore_auth_events_in_this_tab', 'true');
      } else if (event.key === 'password_reset_in_progress' && event.newValue === null) {
        // Reset flow completed
        logger.info('Password reset flow completed');
        shouldIgnoreAuthEvents = false;
        localStorage.removeItem('ignore_auth_events_in_this_tab');
      }
    };

    // Add storage listener
    window.addEventListener('storage', handleStorageChange);

    // Handle auth state changes - but we're not going to forcefully sign out
    // Instead, we'll just let the AuthContext know that it should ignore certain events
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((event, session) => {
      // Log the event but don't take action here
      if (shouldIgnoreAuthEvents) {
        logger.info(`Ignoring auth event ${event} during password reset flow in another tab`);
      }
    });

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      authListener.unsubscribe();
      localStorage.removeItem('ignore_auth_events_in_this_tab');
    };
  }, []);
}
