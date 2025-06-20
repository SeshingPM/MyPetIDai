import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { withFreshSession } from '@/utils/document-api/accessWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle } from 'lucide-react';

/**
 * ProcessingRegistration page component
 * Shows a staged Pet ID generation experience:
 * 1. "Generating your Pet ID..." with loader
 * 2. "Your Pet ID has been generated!" with the actual ID
 * 3. Automatic redirect to dashboard
 */
const ProcessingRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'generating' | 'generated' | 'redirecting'>('generating');
  const [petIdentifier, setPetIdentifier] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<'checking' | 'found' | 'not-found'>('checking');
  const [hasValidSession, setHasValidSession] = useState(false);
  const { user, session } = useAuth();

  // Check if a previous sign-in was successful during onboarding
  const checkPreviousSignIn = (): boolean => {
    const signInSuccess = sessionStorage.getItem('auth_sign_in_success');
    if (signInSuccess === 'true') {
      logger.info('Sign-in was already successful during onboarding');
      setSessionStatus('found');
      setHasValidSession(true);
      // Clean up the flag
      sessionStorage.removeItem('auth_sign_in_success');
      return true;
    }
    return false;
  };
  
  // Function to check session status with the withFreshSession utility
  const checkAndHandleSession = async (): Promise<boolean> => {
    setSessionStatus('checking');
    
    // First check if we already know sign-in was successful
    if (checkPreviousSignIn()) {
      return true;
    }
    
    // Next, check if we have a session in the React context
    if (session) {
      logger.info('Session found in context');
      setSessionStatus('found');
      setHasValidSession(true);
      return true;
    }
    
    // Then, try using withFreshSession utility which handles refreshes and errors
    try {
      const result = await withFreshSession(
        async () => {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          return data.session;
        },
        {
          operationName: 'checkSessionForRedirect',
          retryOnFailure: true,
          showToasts: false
        }
      );
      
      if (result) {
        logger.info('Session found via withFreshSession');
        setSessionStatus('found');
        setHasValidSession(true);
        return true;
      }
    } catch (error) {
      logger.error('Error checking session:', error);
    }
    
    // Third attempt: explicit refresh attempt if onboarding was just completed
    const completedOnboarding = sessionStorage.getItem('completed_onboarding') === 'true';
    if (completedOnboarding) {
      logger.info('No session found but onboarding flag present, attempting refresh');
      try {
        const { data } = await supabase.auth.refreshSession();
        if (data.session) {
          logger.info('Session refreshed successfully');
          setSessionStatus('found');
          return true;
        }
      } catch (refreshError) {
        logger.error('Failed to refresh session:', refreshError);
      }
    }
    
    logger.warn('No session found after all attempts');
    setSessionStatus('not-found');
    return false;
  };

  // Function to fetch the pet identifier
  const fetchPetIdentifier = async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('pet_identifier')
        .eq('user_id', user?.id)
        .single();
      
      if (error) {
        logger.error('Error fetching pet identifier:', error);
        return null;
      }
      
      return data?.pet_identifier || null;
    } catch (error) {
      logger.error('Error in fetchPetIdentifier:', error);
      return null;
    }
  };

  // Function to handle successful navigation to dashboard
  const navigateToDashboard = () => {
    // Clear all temporary flags
    try {
      sessionStorage.removeItem('completed_onboarding');
      sessionStorage.removeItem('auth_sign_in_success');
      sessionStorage.removeItem('onboarding_completed');
    } catch (error) {
      logger.error('Error clearing session storage:', error);
    }
    
    logger.info('Navigating to dashboard');
    navigate('/dashboard', { replace: true });
  };

  // Function to handle fallback to login
  const handleFallbackToLogin = () => {
    logger.warn('Redirecting to login due to session issues');
    navigate('/login', { replace: true });
  };

  // Main effect to handle the staged experience
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    const runStagedExperience = async () => {
      // Stage 1: Check session and fetch pet ID (during "generating" stage)
      const hasSession = await checkAndHandleSession();
      
      if (!hasSession) {
        toast.error('Session not established. Redirecting to login...');
        setTimeout(() => handleFallbackToLogin(), 1500);
        return;
      }

      // Fetch pet identifier
      const petId = await fetchPetIdentifier();
      if (petId) {
        setPetIdentifier(petId);
      }

      // Stage 2: After 2.5 seconds, show "generated" stage
      const generateTimeout = setTimeout(() => {
        setStage('generated');
        
        // Stage 3: After another 4 seconds, start redirecting
        const redirectTimeout = setTimeout(() => {
          setStage('redirecting');
          
          // Final redirect after 1.5 more seconds
          const finalTimeout = setTimeout(() => {
            navigateToDashboard();
          }, 1500);
          
          timeouts.push(finalTimeout);
        }, 4000);
        
        timeouts.push(redirectTimeout);
      }, 2500);
      
      timeouts.push(generateTimeout);
    };

    runStagedExperience();

    // Cleanup function
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [navigate, user]);

  // Render different content based on stage
  const renderContent = () => {
    switch (stage) {
      case 'generating':
        return (
          <>
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Generating your Pet ID...</h1>
              <p className="text-gray-600">Creating a unique identifier for your pet</p>
            </div>
          </>
        );
      
      case 'generated':
        return (
          <>
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Pet ID has been generated!</h1>
              <p className="text-gray-600">Your pet now has a unique digital identity</p>
            </div>
            
            {petIdentifier && (
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                <p className="font-medium text-gray-700 mb-2">Your Pet ID:</p>
                <p className="text-2xl font-bold text-primary mb-2">{petIdentifier}</p>
                <p className="text-sm text-gray-600">Save this ID for your records and share it with your vet</p>
              </div>
            )}
          </>
        );
      
      case 'redirecting':
        return (
          <>
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Taking you to your dashboard...</h1>
              <p className="text-gray-600">Get ready to explore your pet's profile</p>
            </div>
            
            {petIdentifier && (
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                <p className="font-medium text-gray-700 mb-2">Your Pet ID:</p>
                <p className="text-2xl font-bold text-primary mb-2">{petIdentifier}</p>
                <p className="text-sm text-gray-600">Save this ID for your records and share it with your vet</p>
              </div>
            )}
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Generating Your Pet ID | MyPetID</title>
        <meta name="description" content="Creating your pet's unique digital identity" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
          {renderContent()}
          
          {/* Progress indicator */}
          <div className="mt-8 flex justify-center gap-2">
            <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              stage === 'generating' ? 'bg-primary' : 'bg-green-500'
            }`} />
            <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              stage === 'generating' ? 'bg-gray-200' : stage === 'generated' ? 'bg-primary' : 'bg-green-500'
            }`} />
            <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              stage === 'redirecting' ? 'bg-primary' : 'bg-gray-200'
            }`} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcessingRegistration;
