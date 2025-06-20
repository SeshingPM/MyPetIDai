import React, { useEffect, useState } from "react";
import useDeferredRender from "@/hooks/use-deferred-render";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logger from "@/utils/logger";

// Extend Window interface for custom property
declare global {
  interface Window {
    petdocument_initial_load?: boolean;
  }
}

// Constants for debouncing background session refresh
const BACKGROUND_REFRESH_DEBOUNCE_MS = 5000; // 5 seconds
const LAST_AUTH_REFRESH_ATTEMPT_KEY = "lastAuthRefreshAttemptTimestamp";

// Auth flow exemption flags
const VERIFICATION_FLOW_FLAG = "petdoc_in_verification_flow"; // Must match the flag in VerifyHandler.tsx

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdminStatus, setIsCheckingAdminStatus] =
    useState(requireAdmin);
  const [authTimeoutReached, setAuthTimeoutReached] = useState(false);

  // Check if this is a page refresh - defined once at the component level
  // This detects if the current page load is due to a browser refresh action
  const isPageRefresh =
    typeof window !== "undefined" &&
    window.performance &&
    ((window.performance.navigation &&
      window.performance.navigation.type === 1) ||
      (window.performance.getEntriesByType &&
        window.performance.getEntriesByType("navigation")[0] &&
        (window.performance.getEntriesByType("navigation")[0] as any).type ===
          "reload"));

  // Detect if this is a mobile device - simple detection that doesn't break existing flows
  const isMobileDevice =
    typeof window !== "undefined" &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Check if we have a session in localStorage - move this up for early access
  const hasStoredSession =
    typeof localStorage !== "undefined" &&
    (localStorage.getItem("pet-care-auth-token-prod") !== null ||
      localStorage.getItem("pet-care-auth-token-test") !== null);

  // Check if this is an email verification flow (set by VerifyHandler.tsx)
  const isVerificationFlow =
    typeof window !== "undefined" &&
    (sessionStorage.getItem(VERIFICATION_FLOW_FLAG) === "true" ||
      localStorage.getItem(VERIFICATION_FLOW_FLAG) === "true");

  // Detect if this is a shared document page - these should never require auth
  const isSharedDocumentPage =
    location.pathname.includes("/shared/") ||
    location.pathname.includes("/documents/shared/");

  // Combined special cases where we should skip auth checking/redirects
  const shouldSkipAuthRedirect =
    isVerificationFlow ||
    (isMobileDevice && isPageRefresh && hasStoredSession) ||
    isSharedDocumentPage;

  // Set up a timeout for authentication check
  useEffect(() => {
    // Skip timeout for mobile devices and page refreshes to prevent premature redirects
    if (isMobileDevice || isPageRefresh) return;

    // If auth check takes too long, we'll redirect to login
    const timeout = setTimeout(() => {
      if (isLoading && !user) {
        setAuthTimeoutReached(true);
        logger.warn("Authentication check timed out, redirecting to login");
      }
    }, 5000); // 5 seconds timeout - increased from 2 seconds for slower connections

    return () => clearTimeout(timeout);
  }, [isLoading, user, isMobileDevice, isPageRefresh]);

  // Store the current path in session storage when component mounts
  // This helps us recover after page refreshes
  useEffect(() => {
    if (
      location.pathname &&
      location.pathname !== "/" &&
      !location.pathname.includes("/login") &&
      !location.pathname.includes("/signup")
    ) {
      sessionStorage.setItem("last-authenticated-path", location.pathname);
    }
  }, [location.pathname]);

  // Redirect if timeout reached or explicitly no user after loading
  // But only if this is not a page refresh OR if it's a mobile refresh without a stored session
  useEffect(() => {
    // On page refresh, we want to be more patient with auth checks
    // and avoid premature redirects, especially on mobile if a session might exist.
    if (isMobileDevice && isPageRefresh && hasStoredSession) {
      logger.debug(
        "Mobile page refresh with stored session: deferring redirect decision, allowing background refresh."
      );
      return; // Give background refresh a chance
    }

    if (
      !isPageRefresh &&
      ((authTimeoutReached && !user) || (!isLoading && !user))
    ) {
      logger.debug(
        "No user found after auth check (not a page refresh), redirecting to login"
      );
      navigate("/login", { state: { from: location } });
    } else if (isPageRefresh && !hasStoredSession && !isLoading && !user) {
      // If it's a page refresh, no stored session, and auth check is done with no user
      logger.debug(
        "No user found after auth check (page refresh, no stored session), redirecting to login"
      );
      navigate("/login", { state: { from: location } });
    }

    // The original mobile device log for avoiding redirects is still relevant for other scenarios
    if (isMobileDevice && isPageRefresh) {
      logger.debug("Mobile page refresh detected - general handling");
    }
  }, [
    authTimeoutReached,
    isLoading,
    user,
    navigate,
    location,
    isMobileDevice,
    isPageRefresh,
    hasStoredSession,
  ]);

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user && requireAdmin) {
        setIsCheckingAdminStatus(true);
        try {
          const { data, error } = await supabase.rpc("is_admin");

          if (error) {
            logger.error("Error checking admin status:", error);
            toast.error("Failed to verify admin access");
            setIsAdmin(false);
            navigate("/dashboard", { replace: true });
          } else {
            setIsAdmin(data);

            if (!data) {
              toast.error("You don't have permission to access this page");
              navigate("/dashboard", { replace: true });
            }
          }
        } catch (error) {
          logger.error("Unexpected error checking admin status:", error);
          toast.error("An unexpected error occurred");
          navigate("/dashboard", { replace: true });
        } finally {
          setIsCheckingAdminStatus(false);
        }
      } else if (!requireAdmin) {
        setIsCheckingAdminStatus(false);
      }
    };

    checkAdminStatus();
  }, [user, requireAdmin, navigate]);

  // Use deferred rendering to prevent loader flashing when navigating between tabs
  const shouldRender = useDeferredRender(
    "auth-check", // Component ID
    300, // Initial delay (ms)
    0, // Subsequent delay (ms) - render immediately after first time
    [isLoading, authTimeoutReached, requireAdmin, isCheckingAdminStatus, user]
  );

  // Determine if we should show the loading state
  const shouldShowLoading = () => {
    // Check if this is the initial page load
    const isInitialLoad =
      typeof window !== "undefined" && window.petdocument_initial_load === true;

    // If this is the initial page load, don't show loading
    if (isInitialLoad) {
      return false;
    }

    // Never show loading on page refresh - this prevents flashing and redirects
    if (isPageRefresh) {
      return false;
    }

    // If we've been on this page for less than 1 second, don't show loading
    // This prevents the flash during initial load
    if (performance.now() < 1000) {
      return false;
    }

    // Check if we have a session in localStorage - if so, we're likely authenticated
    // and just waiting for the session to be loaded
    if (hasStoredSession && isPageRefresh) {
      return false;
    }

    // Only show loading if we're still checking auth and haven't rendered before
    return (
      ((isLoading && !authTimeoutReached) ||
        (requireAdmin && isCheckingAdminStatus)) &&
      !shouldRender
    );
  };

  // Show loading state while checking authentication or admin status
  // But only if we need to show the loader and haven't rendered this component before
  if (shouldShowLoading()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get the last authenticated path from session storage
  const lastAuthPath = sessionStorage.getItem("last-authenticated-path");

  // Special handling for mobile devices on refresh
  if (isMobileDevice && isPageRefresh && hasStoredSession) {
    logger.debug(
      "Mobile refresh detected in render - showing content without redirect"
    );

    const now = Date.now();
    const lastAttemptTimestamp = parseInt(
      sessionStorage.getItem(LAST_AUTH_REFRESH_ATTEMPT_KEY) || "0",
      10
    );

    if (now - lastAttemptTimestamp > BACKGROUND_REFRESH_DEBOUNCE_MS) {
      sessionStorage.setItem(LAST_AUTH_REFRESH_ATTEMPT_KEY, now.toString());
      // Force a session refresh attempt in the background
      setTimeout(async () => {
        try {
          logger.info(
            "Attempting debounced background session refresh for mobile"
          );
          const { data, error } = await supabase.auth.refreshSession();
          if (error) {
            logger.warn(
              "Background session refresh failed on mobile:",
              error.message
            );
          } else if (data.session) {
            logger.info("Background session refresh successful on mobile");
          } else {
            logger.warn(
              "Background session refresh on mobile did not return a session or user."
            );
          }
        } catch (err: any) {
          logger.error(
            "Exception during background session refresh on mobile:",
            err.message
          );
        }
      }, 100); // Keeping 100ms delay, could be 0 if preferred
    } else {
      logger.debug("Background session refresh attempt debounced for mobile.");
    }

    // Show content without redirect if we have stored tokens, allowing auth to resolve
    return <>{children}</>;
  }

  // ONLY redirect to login if:
  // 1. We don't have a user AND
  // 2. This is NOT a page refresh OR we don't have a stored session AND
  // 3. This is NOT a special case (verification flow, shared document page)
  if (
    !user &&
    (!isPageRefresh || !hasStoredSession) &&
    !shouldSkipAuthRedirect
  ) {
    logger.debug(
      "Redirecting to login: not authenticated and no special case bypass"
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Special case for shared document pages - always show content, no auth required
  if (isSharedDocumentPage) {
    logger.debug("Detected shared document page, bypassing auth checks");
    return <>{children}</>;
  }

  // Special case for verification flow - always show content
  if (isVerificationFlow) {
    logger.debug(
      "RequireAuth: Detected verification flow, bypassing auth checks"
    );
    return <>{children}</>;
  }

  // If this is a page refresh and we have a stored session but no user yet,
  // don't redirect - just show children and let auth complete in the background
  if (!user && isPageRefresh && hasStoredSession) {
    logger.debug(
      "Page refresh with stored session detected - showing content without redirect"
    );
    return <>{children}</>;
  }

  // If admin is required but user is not admin, the redirection is handled in useEffect
  if (requireAdmin && !isAdmin && !isCheckingAdminStatus) {
    return null; // Will be redirected by useEffect
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default RequireAuth;
