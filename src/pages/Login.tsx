import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import AuthForm from "@/components/auth/AuthForm";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/seo/SEO";
import logger from '@/utils/logger';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Check for redirect path from processing registration page
  useEffect(() => {
    const authRedirectPath = sessionStorage.getItem('auth_redirect_path');
    if (authRedirectPath) {
      // Only set the redirect if there's no existing return_to in the URL
      if (!searchParams.get('return_to')) {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set('return_to', authRedirectPath);
          return newParams;
        });
      }
      // Clear the stored path after using it
      sessionStorage.removeItem('auth_redirect_path');
    }
  }, [location, searchParams, setSearchParams]);

  const returnTo = searchParams.get('return_to');
  // All features are now free - no payment completion needed
  const fromSignup = searchParams.get('fromSignup') === 'true';
  
  // Get the path they were trying to access - fixed to properly handle state
  const locationState =
    (location.state as {
      from?: string | { pathname: string };
      planType?: string;
    }) || {};
  const from =
    returnTo ? `/${returnTo}` : 
    typeof locationState.from === "string"
      ? locationState.from
      : locationState.from?.pathname || "/dashboard";

  logger.info("Login redirect destination:", from);
  
  // All features are now free - no subscription status needed

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(undefined);

    logger.info("Attempting login with:", data.email);
    const { error, success } = await signIn(data.email, data.password);

    if (error) {
      logger.info("Login error:", error.message);
      setError(error.message);
      
      // Show different toast messages based on the specific error
      if (error.message.includes("not confirmed")) {
        toast.error("Please confirm your email before logging in.");
      } else if (error.message.includes("Invalid login credentials")) {
        toast.error("Login failed. Please check your credentials.");
      } else {
        toast.error("Login failed: " + error.message);
      }
    } else if (success) {
      // All features are now free - no checkout redirection needed

      // Simple redirect and success message
      const finalRedirectPath = from;
      logger.info("Login successful, redirecting to:", finalRedirectPath);
      toast.success("Logged in successfully!", {
        position: "bottom-right",
        duration: 5000
      });

      // Manually navigate to the determined path
      navigate(finalRedirectPath);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Login | MyPetID"
        description="Login to your MyPetID account to access your pet records."
      />
      <Header />

      <main className="pt-24 pb-16">
        <div className="container-narrow">
          <div className="max-w-md mx-auto">
            {fromSignup && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md">
                <p className="font-bold">Email Confirmation Needed</p>
                <p>Please confirm your email before logging in.</p>
              </div>
            )}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <AuthForm
                type="login"
                onSubmit={handleLogin}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
