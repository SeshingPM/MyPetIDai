import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';

// Local imports
import logger from '@/utils/logger';
import { trackEvent } from '@/integrations/posthog/client';
import { ONBOARDING_EVENTS } from '@/utils/analytics-events';
import type { Database } from '@/integrations/supabase/types';
import { submitOnboardingData } from '@/api/onboarding';

// Components
import OnboardingLayout from '@/components/layout/OnboardingLayout';
import ProgressBar from './ProgressBar';
import PetInfoStep from './steps/PetInfoStep';
import OwnerInfoStep from './steps/OwnerInfoStep';
import PetLifestyleStep from './steps/PetLifestyleStep';
import AccountCreationStep from './steps/AccountCreationStep';

// Types and Schemas
import { 
  OnboardingState, 
  OnboardingStepId, 
  NavigationDirection, 
  PetInfo, 
  OwnerInfo, 
  PetLifestyle, 
  AccountInfo,
  PetInfoSchema,
  OwnerInfoSchema,
  PetLifestyleSchema,
  AccountInfoSchema
} from '@/types/onboarding';

/**
 * Main container component for the onboarding flow
 * Manages state and navigation between steps
 */
const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track onboarding start
  useEffect(() => {
    trackEvent(ONBOARDING_EVENTS.STARTED);
    
    // Track abandoned onboarding when user leaves the page
    return () => {
      // Only track abandonment if not completing the flow
      if (document.visibilityState === 'hidden') {
        trackEvent(ONBOARDING_EVENTS.SKIPPED);
      }
    };
  }, []);
  
  // Initialize onboarding state
  const [state, setState] = useState<OnboardingState>({
    currentStep: OnboardingStepId.PET_INFO,
    petInfo: {
      name: '',
      type: '',
      breed: '',
      gender: '',
      birth_or_adoption_date: null,
      photo: null,
      photoUrl: undefined,
    },
    ownerInfo: {
      firstName: '',
      lastName: '',
      zipCode: '',
      phone: '',
      smsOptIn: false,
    },
    petLifestyle: {
      food: [],
      treats: [],
      allergies: [],
      medications: [],
      supplements: [],
      insurance: '',
      documents: null,
      documentUrls: [],
    },
    accountInfo: {
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    }
  });

  /**
   * Handle navigation between steps
   */
  const handleNavigation = (direction: NavigationDirection, targetStep?: number) => {
    // Calculate the new step based on direction or target
    let newStep: number;
    
    if (direction === 'goto' && targetStep) {
      newStep = targetStep;
    } else if (direction === 'next') {
      newStep = state.currentStep + 1;
    } else {
      // previous
      newStep = state.currentStep - 1;
    }
    
    // Ensure step is within valid range
    if (newStep < OnboardingStepId.PET_INFO || newStep > OnboardingStepId.ACCOUNT_CREATION) {
      return;
    }
    
    // Update state with new step
    setState((prevState) => ({
      ...prevState,
      currentStep: newStep
    }));
    
    // Scroll to top on step change
    window.scrollTo(0, 0);
  };

  /**
   * Update state for a specific step
   */
  const updateStepData = <K extends keyof OnboardingState>(step: K, data: Partial<OnboardingState[K]>) => {
    setState((prevState) => {
      // Create a proper typed copy of the step data to avoid spread type errors
      const updatedStepData = {
        ...prevState[step] as object,  // Cast to object to avoid TypeScript spread error
        ...data as object              // Cast to object to avoid TypeScript spread error
      } as OnboardingState[K];
      
      const newState = {
        ...prevState,
        [step]: updatedStepData
      };
      
      console.log(`Full state after ${step} update:`, newState);
      return newState;
    });
  };

  /**
   * Final form submission handler
   * Can accept accountInfo directly to avoid state timing issues
   */
  const handleSubmit = async (directAccountInfo?: AccountInfo) => {
    try {
      setIsSubmitting(true);
      
      // Use the directly passed account info if provided (from AccountCreationStep)
      // This avoids race conditions with state updates
      const accountInfo = directAccountInfo || state.accountInfo;
      
      // Update state with the passed account info to keep it in sync
      if (directAccountInfo) {
        updateStepData('accountInfo', directAccountInfo);
      }
      
      // Validate required fields before submission
      if (!accountInfo.email) {
        throw new Error('Email is required');
      }
      
      if (!accountInfo.password || accountInfo.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      
      if (!state.petInfo.birth_or_adoption_date) {
        throw new Error('Pet birth or adoption date is required');
      }
      
      // Show loading toast
      toast.loading('Creating your account and pet profile...', { id: 'onboarding-submit' });
      
      // Create submission state with the direct account info
      const submissionState = {
        ...state,
        accountInfo: accountInfo
      };
      
      console.log('Submitting with account info:', accountInfo);
      
      // Submit all data using edge function
      const result = await submitOnboardingData(submissionState, state.petInfo.photo || undefined);
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error during onboarding');
      }
      
      // Track successful signup
      trackEvent(ONBOARDING_EVENTS.COMPLETED, { 
        pet_type: state.petInfo.type,
        has_phone: !!state.ownerInfo.phone,
        sms_opted_in: state.ownerInfo.smsOptIn
      });
      
      // Display success message
      toast.success('Welcome to MyPetID! Account created successfully', { id: 'onboarding-submit' });
      
      // Set a flag to indicate onboarding is complete for auth redirect handling
      sessionStorage.setItem('completed_onboarding', 'true');
      
      // Store the pet identifier
      if (result.pet_identifier) {
        sessionStorage.setItem('new_pet_identifier', result.pet_identifier);
      }
      
      logger.info('Attempting to sign in with created account');
      try {
        // Get account info from direct parameter or state
        const accountInfo = directAccountInfo || state.accountInfo;
        
        // Explicitly sign in the user with the credentials used during account creation
        const signInResult = await signIn(
          accountInfo.email, 
          accountInfo.password
        );

        // Store auth result status in sessionStorage to optimize the processing page flow
        if (signInResult.success) {
          logger.info('Successfully signed in after account creation');
          sessionStorage.setItem('auth_sign_in_success', 'true');
        } else {
          logger.warn('Sign-in after account creation failed, will retry on processing page');
          sessionStorage.setItem('auth_sign_in_success', 'false');
        }
        
        // Always navigate to processing page as intended
        navigate('/processing-registration', { replace: true });
      } catch (signInError) {
        logger.error('Exception during sign-in attempt:', signInError);
        sessionStorage.removeItem('auth_sign_in_success');
        navigate('/processing-registration', { replace: true });
      }
    } catch (error) {
      logger.error('Error submitting onboarding data:', error);
      toast.dismiss('onboarding-submit');
      toast.error(error instanceof Error ? error.message : 'There was an error creating your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Render the current step component
   */
  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case OnboardingStepId.PET_INFO:
        return (
          <PetInfoStep
            data={state.petInfo}
            onUpdate={(data) => updateStepData('petInfo', data)}
            onNext={() => handleNavigation('next')}
            onPrevious={() => handleNavigation('previous')}
          />
        );
      
      case OnboardingStepId.OWNER_INFO:
        return (
          <OwnerInfoStep
            data={state.ownerInfo}
            onUpdate={(data) => updateStepData('ownerInfo', data)}
            onNext={() => handleNavigation('next')}
            onPrevious={() => handleNavigation('previous')}
          />
        );
      
      case OnboardingStepId.PET_LIFESTYLE:
        return (
          <PetLifestyleStep
            data={state.petLifestyle}
            petType={state.petInfo.type}
            onUpdate={(data) => updateStepData('petLifestyle', data)}
            onNext={() => handleNavigation('next')}
            onPrevious={() => handleNavigation('previous')}
          />
        );
      
      case OnboardingStepId.ACCOUNT_CREATION:
        return (
          <AccountCreationStep
            data={state.accountInfo}
            onUpdate={(data) => updateStepData('accountInfo', data)}
            onNext={(formData) => {
              // Pass the form data directly to handleSubmit to avoid race condition
              if (formData) {
                handleSubmit(formData);
              } else {
                handleSubmit();
              }
            }}
            onPrevious={() => handleNavigation('previous')}
            isSubmitting={isSubmitting}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout>
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar Section */}
        <div className="mb-12">
          <ProgressBar
            currentStep={state.currentStep}
            totalSteps={4}
            onStepClick={(step) => handleNavigation('goto', step)}
            allowNavigation={true}
          />
        </div>
        
        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 md:p-12">
          {renderCurrentStep()}
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingFlow;
