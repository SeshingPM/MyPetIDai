import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import logger from "@/utils/logger";

/**
 * User access details for free platform
 * This is a simplified version that always returns full access to all features
 */
export interface UserAccessDetails {
  user_id: string;
  plan_type: string;
  status: string;
}

export interface UseUserAccessStatusResult {
  hasFullAccess: boolean;
  accessDetails: UserAccessDetails | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseUserAccessStatusOptions {
  skipCache?: boolean;
  forceLoadingState?: boolean;
}

/**
 * Hook that always returns active user access status
 * Since the platform is now completely free with all features available to everyone
 */
export function useUserAccessStatus(options: UseUserAccessStatusOptions = {}): UseUserAccessStatusResult {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [accessDetails, setAccessDetails] = useState<UserAccessDetails | null>(null);

  useEffect(() => {
    // Simple effect to simulate loading state briefly
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // If user is logged in, create mock access details
      if (user) {
        setAccessDetails({
          user_id: user.id,
          plan_type: "FREE",
          status: "active"
        });
        logger.info("Set full access status for user:", user.id);
      } else {
        setAccessDetails(null);
        logger.info("No user found, access details cleared");
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user]);

  // If forceLoadingState is true, override the isLoading state
  const effectiveIsLoading = options.forceLoadingState === true ? true : isLoading;
  
  // Always return full access if user is logged in
  return {
    // Only return true if user is actually logged in
    hasFullAccess: !!user,
    accessDetails,
    isLoading: effectiveIsLoading,
    error: null,
    refetch: async () => {
      // No-op refetch function as we don't need to check anything
      logger.info("Access status refetch called (no-op in free platform)");
    }
  };
}

// Re-export for backwards compatibility with existing code
// Will help during transition period
export function useSubscriptionStatus(options: UseUserAccessStatusOptions = {}): UseUserAccessStatusResult {
  logger.warn("useSubscriptionStatus is deprecated, use useUserAccessStatus instead");
  return useUserAccessStatus(options);
}
