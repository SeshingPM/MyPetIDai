import React, { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logger from "@/utils/logger";
import SEO from "@/components/seo/SEO";
import { detectBrowser } from "@/utils/browser";

// Define constants for verification flow flags (similar to password reset flow)
const VERIFICATION_FLOW_FLAG = 'petdoc_in_verification_flow';

const VerifyHandler: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useLayoutEffect to set flags before any rendering happens
  // This ensures flags are set before RequireAuth can evaluate them
  useLayoutEffect(() => {
    // Check if this appears to be a verification callback from URL hash
    const isVerificationCallback = window.location.hash.includes('type=signup');
    
    if (isVerificationCallback) {
      // Set flags in both localStorage and sessionStorage to mark this as a verification flow
      // These flags will be checked by RequireAuth to exempt this route from redirection
      localStorage.setItem(VERIFICATION_FLOW_FLAG, 'true');
      sessionStorage.setItem(VERIFICATION_FLOW_FLAG, 'true');
      
      logger.info('VerifyHandler: Set verification flow flags');
    } else {
      logger.warn('VerifyHandler: No verification parameters detected in URL hash');
    }
    
    // Clean up flags when component unmounts
    return () => {
      localStorage.removeItem(VERIFICATION_FLOW_FLAG);
      sessionStorage.removeItem(VERIFICATION_FLOW_FLAG);
      logger.info('VerifyHandler: Cleaned up verification flow flags');
    };
  }, []);

  // Main verification handling effect
  useEffect(() => {
    const handleVerification = async () => {
      setIsProcessing(true);
      
      try {
        logger.info("VerifyHandler: Processing verification from URL");
        
        // Check if we have auth parameters in the URL
        if (!window.location.hash.includes("access_token")) {
          logger.error("VerifyHandler: No access token found in URL");
          setError("No verification parameters found in URL");
          setIsProcessing(false);
          return;
        }

        // Extract confirmation type from the URL to confirm this is a signup verification
        const isSignupConfirmation = window.location.hash.includes("type=signup");
        if (!isSignupConfirmation) {
          logger.info("VerifyHandler: Not a signup confirmation, redirecting to dashboard");
          navigate("/dashboard");
          return;
        }

        // The session should be automatically established by Supabase's client library
        // when it detects the hash parameters in the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error("VerifyHandler: Error getting session from URL", { error });
          setError(`Verification failed: ${error.message}`);
          setIsProcessing(false);
          return;
        }

        if (!data.session) {
          logger.error("VerifyHandler: No session returned from getSessionFromUrl");
          setError("Verification failed: No session established");
          setIsProcessing(false);
          return;
        }

        // Successfully verified and signed in
        logger.info("VerifyHandler: Successfully verified email and signed in");
        
        // Detect browser for logging and debugging
        const { name: browserName, version: browserVersion } = detectBrowser();
        const isIOSSafari = browserName === 'Safari' && navigator.userAgent.includes('iPhone');
        logger.info("VerifyHandler: Browser detection", { browserName, browserVersion, isIOSSafari });
        
        // All features are now free - no subscription or promo code logic needed
        
        // Get user ID from the new session
        const userId = data.session.user.id;
        
        // Update registration status to 'verified'
        try {
          const { error: statusError } = await supabase
            .from("user_registration_status")
            .update({
              registration_status: "verified",
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);
            
          if (statusError) {
            logger.error("VerifyHandler: Error updating registration status", { error: statusError });
            // Don't throw, just log this error as it's not critical
          } else {
            logger.info("VerifyHandler: Updated registration status to verified");
          }
        } catch (e) {
          logger.error("VerifyHandler: Exception updating registration status", { error: e });
          // Don't throw, continue with the flow
        }
        
        toast.success("Email verification successful! Welcome to MyPetID.");

        // All features are now free, simply redirect to dashboard
        logger.info("VerifyHandler: Email verified, redirecting to dashboard");
        navigate("/dashboard");
      } catch (e) {
        // Catch any unexpected errors
        logger.error("VerifyHandler: Unexpected error during verification handling", { error: e });
        setError("An unexpected error occurred during verification");
        setIsProcessing(false);
      }
    };

    handleVerification();
  }, [navigate]);

  // Show a simple loading UI while processing
  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <SEO 
          title="Verifying Your Account | MyPetID" 
          description="Please wait while we verify your account."
        />
        <div className="bg-white p-8 rounded-2xl shadow-soft max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Verifying Your Account</h1>
          <p className="text-gray-600">Please wait while we complete your email verification...</p>
        </div>
      </div>
    );
  }

  // Show an error UI if something went wrong
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <SEO 
          title="Verification Error | MyPetID" 
          description="There was an error verifying your account."
        />
        <div className="bg-white p-8 rounded-2xl shadow-soft max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Verification Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // This shouldn't normally render as we redirect before this point
  return null;
};

export default VerifyHandler;
