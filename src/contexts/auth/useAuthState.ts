import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import logger from '@/utils/logger';

// Helper function to detect mobile devices
const isMobileDevice = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Helper function to detect page refresh with better cross-browser support
const isPageRefresh = () => {
  // Modern browsers
  if (window.performance && window.performance.getEntriesByType) {
    const navEntries = window.performance.getEntriesByType('navigation');
    if (navEntries.length > 0) {
      return (navEntries[0] as any).type === 'reload';
    }
  }
  
  // Older browsers
  if (window.performance && window.performance.navigation) {
    return window.performance.navigation.type === 1;
  }
  
  return false;
};

// Helper to store last valid path for recovery
const storeLastValidPath = (path: string) => {
  if (path && path !== '/' && !path.includes('/login') && !path.includes('/signup')) {
    localStorage.setItem('pet-care-last-valid-path', path);
  }
};

// Helper to get last valid path
const getLastValidPath = () => {
  return localStorage.getItem('pet-care-last-valid-path') || '/dashboard';
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Track the last auth event and when it occurred
  const [lastAuthEvent, setLastAuthEvent] = useState<string | null>(null);
  const [lastAuthEventTime, setLastAuthEventTime] = useState<number | null>(null);
  // Track if this is the first auth event or a subsequent one
  const [initialAuthComplete, setInitialAuthComplete] = useState(false);
  // Track if this is a genuine login or just a session refresh
  const [isSessionRefresh, setIsSessionRefresh] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Listen for custom auth events dispatched by the Supabase client wrapper
  useEffect(() => {
    const handleSignIn = (event: CustomEvent) => {
      logger.debug('Custom SUPABASE_AUTH_SIGNED_IN event detected in useAuthState', event.detail);
      // This event signifies a new, genuine sign-in, not a session refresh.
      setIsSessionRefresh(false);
    };
    
    const handleSessionRefresh = (event: CustomEvent) => {
      logger.debug('Custom SUPABASE_SESSION_REFRESHED event detected in useAuthState', event.detail);
      // This event signifies an existing session being refreshed.
      setIsSessionRefresh(true);
    };
    
    window.addEventListener('SUPABASE_AUTH_SIGNED_IN', handleSignIn as EventListener);
    window.addEventListener('SUPABASE_SESSION_REFRESHED', handleSessionRefresh as EventListener);
    
    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('SUPABASE_AUTH_SIGNED_IN', handleSignIn as EventListener);
      window.removeEventListener('SUPABASE_SESSION_REFRESHED', handleSessionRefresh as EventListener);
    };
  }, []); // Run once on mount

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        logger.debug("useAuthState: getInitialSession triggered", { path: location.pathname, hash: location.hash });
        const isResetFlow = sessionStorage.getItem('is_reset_password_flow') === 'true' || 
                            window.location.hash.includes('type=recovery');

        if (!isResetFlow) {
          if (localStorage.getItem('supabase.auth.token')) {
            logger.warn("Supabase token found in localStorage, this is deprecated. It should be under 'pet-care-auth-token-prod' or 'pet-care-auth-token-test'. Attempting to clear.");
            localStorage.removeItem('supabase.auth.token');
          }
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          logger.error("Error getting initial session:", error);
          // setIsLoading(false) will be handled by INITIAL_SESSION event or other events
          return;
        }

        if (data.session) {
          logger.debug("Initial session found by getSession:", data.session.user?.id);
          // Actual state update deferred to onAuthStateChanged
        } else if (!isResetFlow) {
          logger.debug("No initial session found by getSession and not in reset flow.");
        }
        // setIsLoading(false) will be handled by onAuthStateChanged event 'INITIAL_SESSION'
      } catch (e) {
        logger.error("Unexpected error in getInitialSession:", e);
        // setIsLoading(false) deferred to ensure auth event processing
      }
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        logger.info(`Auth event: ${event}`, { userId: newSession?.user?.id, path: location.pathname, hash: location.hash, eventData: newSession });
        
        const shouldIgnoreAuthEvents = localStorage.getItem('ignore_auth_events_in_this_tab') === 'true';
        const isResetPasswordFlowOnThisPage = sessionStorage.getItem('is_reset_password_flow') === 'true' || location.hash.includes('type=recovery');
        const isPasswordRecoveryEventForThisTab = event === 'PASSWORD_RECOVERY' && isResetPasswordFlowOnThisPage;

        // Process event if not ignoring, or if it's a password recovery for this tab
        if (!shouldIgnoreAuthEvents || isPasswordRecoveryEventForThisTab) {
          setLastAuthEvent(event);
          setLastAuthEventTime(Date.now());

          if (event === "INITIAL_SESSION") {
            logger.debug("Auth event: INITIAL_SESSION", { session: newSession });
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setIsLoading(false); 
          } else if (event === "SIGNED_IN") {
            logger.debug("Auth event: SIGNED_IN", { session: newSession, isSessionRefresh });
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setIsLoading(false);

            const isResetPasswordPage = location.pathname === '/reset-password' || location.hash.includes('type=recovery');
            const isOnUploadPage = location.pathname.startsWith('/upload-document');
            const isOnIOSUploadPage = location.pathname.startsWith('/add-document-ios'); 
            const isOnAndroidUploadPage = location.pathname.startsWith('/add-document-android');
            const isOnDashboard = location.pathname.startsWith('/dashboard');

            // Determine if this SIGNED_IN event should trigger a redirect to dashboard.
            // It should only redirect if:
            // 1. This is NOT the very first auth event being processed in this app instance (i.e., initialAuthComplete is true).
            // 2. This is NOT a mere session refresh (i.e., isSessionRefresh is false, indicating a deliberate sign-in action).
            // 3. The user is not already on an excluded page (reset password, upload, dashboard itself).
            // Check if we're coming from the onboarding flow
            const isFromOnboarding = sessionStorage.getItem('completed_onboarding') === 'true';
            
            // If we're coming from onboarding, we should always redirect regardless of initialAuthComplete
            // Otherwise, use the normal conditions
            const shouldRedirectToDashboard = 
              (isFromOnboarding || initialAuthComplete) &&  // Allow redirect if just completed onboarding
              !isSessionRefresh &&         // True if it's a genuine new login, not a refresh
              !isResetPasswordPage &&
              !isOnUploadPage &&
              !isOnIOSUploadPage &&
              !isOnAndroidUploadPage &&
              !isOnDashboard;

            logger.debug('[onAuthStateChange SIGNED_IN] Redirect check:', {
              pathname: location.pathname,
              initialAuthComplete,
              isSessionRefresh,
              isResetPasswordPage,
              isOnUploadPage,
              isOnDashboard,
              shouldRedirectToDashboard
            });

            if (shouldRedirectToDashboard) {
              logger.info('Redirecting to /dashboard after genuine sign-in.');
              // Clear the onboarding flag after redirect
              sessionStorage.removeItem('completed_onboarding');
              navigate("/dashboard"); 
            } else {
              logger.info('Not redirecting to /dashboard on SIGNED_IN.', { 
                reason: initialAuthComplete ? 
                  (isSessionRefresh ? 'is session refresh' : 'on excluded page or already dashboard') : 
                  'initial auth event cycle',
                isFromOnboarding
              });
            }
          } else if (event === "PASSWORD_RECOVERY") {
            logger.info("Auth event: PASSWORD_RECOVERY - User is in password recovery mode.", { session: newSession });
            setSession(newSession); // This is the temporary recovery session
            setUser(newSession?.user ?? null);
            setIsLoading(false); // Auth state is now determined for this phase
            // No navigation here, ResetPassword.tsx will handle the UI
          } else if (event === "SIGNED_OUT") {
            logger.debug("Auth event: SIGNED_OUT");
            setUser(null);
            setSession(null);
            setIsLoading(false);
            navigate("/", { replace: true });
          }
        } else {
          logger.debug(`Ignoring auth event ${event} due to 'ignore_auth_events_in_this_tab' or not being relevant recovery event.`);
          // If it's an initial session event being ignored, we still need to set loading to false.
          if (event === "INITIAL_SESSION" && !isPasswordRecoveryEventForThisTab) {
             setIsLoading(false);
          }
        }

        // This must be set AFTER the logic above uses its previous state
        if (!initialAuthComplete && (event === "INITIAL_SESSION" || event === "SIGNED_IN")) {
          logger.debug(`Setting initialAuthComplete to true after event: ${event}`);
          setInitialAuthComplete(true);
        }
      }
    );

    return () => {
      logger.debug("Unsubscribing Supabase auth listener");
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname, location.hash, initialAuthComplete, isSessionRefresh]); // Dependencies now include initialAuthComplete and isSessionRefresh

  // All features are now free - no post-verification checkout needed

  // Store the current path when it changes
  useEffect(() => {
    // Only store paths when the user is authenticated (to avoid storing login/signup paths)
    if (session && user) {
      storeLastValidPath(location.pathname);
    }
  }, [location.pathname, session, user]);

  return {
    user,
    session,
    isLoading,
    lastAuthEvent,
    lastAuthEventTime,
    isSessionRefresh,
    setUser, // Exposing for potential direct manipulation if absolutely necessary
    setSession, // Exposing for potential direct manipulation
  };
};
