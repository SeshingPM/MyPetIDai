import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logger from "@/utils/logger";
import SEO from "@/components/seo/SEO";

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  
  // Get the email from location state (passed from Register.tsx)
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, the user shouldn't be on this page
      // Redirect to registration
      navigate("/onboarding", { replace: true });
    }
    
    // Check if user is authenticated - if they're verified, they shouldn't be here
    const checkAuthStatus = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email_confirmed_at) {
        // User is verified, redirect to dashboard
        navigate("/dashboard", { replace: true });
      }
    };
    
    checkAuthStatus();
  }, [location, navigate]);
  
  const handleResendVerification = async () => {
    if (!email || isResending) return;
    
    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) {
        logger.error("Error resending verification email:", error);
        toast.error("Could not resend verification email. Please try again later.");
      } else {
        logger.info("Verification email resent successfully");
        toast.success("Verification email sent! Please check your inbox.");
      }
    } catch (err) {
      logger.error("Unexpected error resending verification email:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };
  
  const handleGoToLogin = async () => {
    // We'll make sure the user is signed out before redirecting to login
    try {
      await signOut();
    } catch (err) {
      logger.error("Error signing out:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <SEO 
        title="Verify Your Email | MyPetID" 
        description="Please verify your email address to continue using MyPetID."
      />
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft p-8 text-center">
        {/* Checkmark icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Please verify your email</h1>
        
        <p className="text-gray-600 mb-6">
          We've sent a verification link to <span className="font-semibold">{email}</span>. 
          Please check your inbox and click the link to continue.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isResending ? "Sending..." : "Resend verification email"}
          </button>
          
          <button
            onClick={handleGoToLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Return to login
          </button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you don't see the email, please check your spam folder or try another email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
