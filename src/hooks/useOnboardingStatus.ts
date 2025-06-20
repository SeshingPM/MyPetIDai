import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import logger from '@/utils/logger';

/**
 * Hook to manage onboarding status for a user
 * Returns whether onboarding should be shown and functions to control it
 */
export function useOnboardingStatus() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user, userMetadata, updateUserMetadata, isLoading } = useAuth();

  // Check if user needs to see onboarding when auth state changes
  useEffect(() => {
    // Skip if auth is still loading or user isn't authenticated
    if (isLoading || !user) {
      return;
    }

    const checkOnboardingStatus = async () => {
      try {
        // Check if has_completed_onboarding flag exists in metadata
        const hasCompletedOnboarding = userMetadata?.has_completed_onboarding === true;
        
        if (!hasCompletedOnboarding) {
          logger.info('User has not completed onboarding, showing tour');
          setShowOnboarding(true);
        } else {
          logger.info('User has already completed onboarding');
          setShowOnboarding(false);
        }
      } catch (error) {
        logger.error('Error checking onboarding status:', error);
        // Default to not showing if there's an error
        setShowOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [user, userMetadata, isLoading]);

  // Function to mark onboarding as complete
  const completeOnboarding = async () => {
    try {
      await updateUserMetadata({ has_completed_onboarding: true });
      setShowOnboarding(false);
      logger.info('Onboarding marked as complete');
    } catch (error) {
      logger.error('Error updating onboarding status:', error);
    }
  };

  // Function to reset onboarding status (mainly for testing)
  const resetOnboarding = async () => {
    try {
      await updateUserMetadata({ has_completed_onboarding: false });
      setShowOnboarding(true);
      logger.info('Onboarding status reset');
    } catch (error) {
      logger.error('Error resetting onboarding status:', error);
    }
  };

  return {
    showOnboarding,
    completeOnboarding,
    resetOnboarding
  };
}

export default useOnboardingStatus;
