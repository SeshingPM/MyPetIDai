import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContextType } from "./auth/types";
import { useAuthState } from "./auth/useAuthState";
import { signIn, signOut, signUp, refreshUserData, changePassword, updateUserMetadata } from "./auth/operations";
import logger from "@/utils/logger";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/integrations/posthog/client";
import { AUTH_EVENTS } from "@/utils/analytics-events";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { user, session, isLoading, lastAuthEvent, lastAuthEventTime, isSessionRefresh, setUser, setSession } = useAuthState();
  
  // Extract user metadata for easier access
  const userMetadata = user?.user_metadata as Record<string, any> | undefined;

  const refreshUser = async () => {
    const updatedUser = await refreshUserData();
    setUser(updatedUser);
    return updatedUser;
  };

 const handleSignIn = async (email: string, password: string) => {
    const { success, session, error } = await signIn(email, password);

    if (success) {
      // Enhanced login tracking with more properties
      trackEvent(AUTH_EVENTS.LOGIN, {
        userId: session?.user.id,
        method: "email",
        timestamp: new Date().toISOString(),
        // Add referrer if available
        referrer: document.referrer || 'direct',
        // Platform detection
        platform: detectPlatform(),
        // Device type
        deviceType: detectDeviceType(),
        // Browser info
        browser: detectBrowser()
      });
    } else {
      // Enhanced failed login tracking
      trackEvent(AUTH_EVENTS.LOGIN_FAILED, {
        error: error?.message,
        email: email.split('@')[1], // Track domain only for privacy
        timestamp: new Date().toISOString(),
        // Add platform information
        platform: detectPlatform(),
        deviceType: detectDeviceType(),
        browser: detectBrowser(),
        // Add attempt information
        attemptType: "password"
      });
    }

    return { success, session, error };
  };
  
  // Helper functions for platform detection
  const detectPlatform = (): string => {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/i.test(ua)) return 'ios';
    return 'desktop';
  };
  
  const detectDeviceType = (): string => {
    const ua = navigator.userAgent;
    return (/Android|iPad|iPhone|iPod|Mobile|Tablet/i.test(ua) || window.innerWidth < 768) ? 'mobile' : 'desktop';
  };
  
  const detectBrowser = (): string => {
    const ua = navigator.userAgent;
    if (/SamsungBrowser/i.test(ua)) return 'samsung';
    if (/Chrome/i.test(ua)) return 'chrome';
    if (/Firefox/i.test(ua)) return 'firefox';
    if (/Safari/i.test(ua)) return 'safari';
    if (/Edge|Edg/i.test(ua)) return 'edge';
    return 'other';
  };

  const handleSignUp = async (
    email: string,
    password: string,
    userData: any
  ) => {
    // Extract referral code if present
    const referralCode = userData.referralCode;
    delete userData.referralCode; // Remove from userData to not store it in user metadata

    // All features are free now - no promo codes or subscriptions needed

    const { success: signUpResultSuccess, session: signUpResultSession, error: signUpResultError } = await signUp(email, password, userData);

    if (signUpResultSuccess) {
      // Show success toast first
      toast.success("Account has been created successfully.");

      // Enhanced signup tracking with detailed properties
      trackEvent(AUTH_EVENTS.SIGN_UP, {
        userId: signUpResultSession?.user.id,
        hasReferral: Boolean(referralCode),
        method: "email",
        timestamp: new Date().toISOString(),
        // Add source attribution
        source: sessionStorage.getItem('signup_source') || 'direct',
        referrer: document.referrer || 'direct',
        // Add platform information
        platform: detectPlatform(),
        deviceType: detectDeviceType(),
        browser: detectBrowser(),
        // Add user properties
        userProperties: Object.keys(userData).filter(key => 
          // Filter out sensitive fields
          !['password', 'referralCode', 'email'].includes(key)
        ).length
      });

      logger.info("Auto-signing in after registration");

      const signInResult = await signIn(email, password);

      if (signInResult.success) {
        // Create a pending registration status
        try {
          const { error: statusError } = await supabase
            .from("user_registration_status")
            .insert({
              user_id: signInResult.session?.user.id,
              registration_status: "pending",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (statusError) {
            logger.error(
              "Error creating pending registration status:",
              statusError
            );
          } else {
            logger.info("Created pending registration status for user");
          }
        } catch (error) {
          logger.error("Error creating registration status:", error);
        }

        // Process referral if present
        if (referralCode) {
          try {
            // Process the referral after signing in
            const { data: referralData } = await supabase
              .from("referral_codes")
              .select("user_id")
              .eq("unique_code", referralCode)
              .maybeSingle();

            if (referralData?.user_id) {
              // Create a referral record
              await supabase.from("referrals").insert({
                referrer_id: referralData.user_id,
                referred_user_id: signInResult.session?.user.id,
              });

              logger.info("Referral processed successfully");

              // Track successful referral
              trackEvent("referral_processed", {
                referrerId: referralData.user_id,
                referredId: signInResult.session?.user.id,
              });
            }
          } catch (error) {
            logger.error("Error processing referral:", error);
          }
        }
      }

      if (
        signInResult.error &&
        signInResult.error.message.includes("not confirmed")
      ) {
        logger.info(
          "Sign-in pending email confirmation - this is expected behavior in production"
        );
        toast.info(
          "Please check your email to confirm your account. You'll need to verify your email before signing in."
        );
      }
    } else {
      // Track registration failure
      trackEvent("signup_failed", {
        error: signUpResultError?.message,
      });
    }

    return { success: signUpResultSuccess, session: signUpResultSession, error: signUpResultError };
  };

  const handleSignOut = async () => {
    try {
      // Track logout event before clearing user data
      if (user) {
        trackEvent(AUTH_EVENTS.LOGOUT, {
          userId: user.id,
        });
      }

      setUser(null);
      setSession(null);
      await signOut();
    } catch (error) {
      logger.error("Error during sign out:", error);
      navigate("/", { replace: true });
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    lastAuthEvent,
    lastAuthEventTime,
    isSessionRefresh,
    userMetadata,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    refreshUser,
    changePassword,
    updateUserMetadata,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
