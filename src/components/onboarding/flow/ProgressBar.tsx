import React from 'react';
import { ProgressBarProps } from '@/types/onboarding';
import { Check } from 'lucide-react';

// Define wrapper to prevent data-lov-id warnings on fragments
const SafeWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="contents" style={{ display: 'contents' }}>{children}</div>
);

/**
 * ProgressBar component for the onboarding flow
 * Displays progress through the multi-step onboarding process
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps, 
  onStepClick, 
  allowNavigation = false 
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  // Step labels
  const stepLabels = [
    'Pet Info',
    'Owner Info',
    'Pet Lifestyle',
    'Create Account',
  ];
  
  /**
   * Handle clicking on a step indicator
   */
  const handleStepClick = (step: number) => {
    // Only allow navigation to previous or current steps
    if (allowNavigation && onStepClick && step <= currentStep) {
      onStepClick(step);
    }
  };
  
  /**
   * Return appropriate classes for step indicator
   */
  const getStepClasses = (step: number) => {
    // Base classes
    let classes = "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 text-sm font-medium ";
    
    // Complete step
    if (step < currentStep) {
      classes += "bg-primary text-white cursor-pointer";
    }
    // Current step
    else if (step === currentStep) {
      classes += "bg-primary text-white ring-4 ring-primary/20";
    }
    // Future step
    else {
      classes += "bg-gray-200 text-gray-500";
    }
    
    return classes;
  };
  
  /**
   * Return appropriate classes for connector line between steps
   */
  const getConnectorClasses = (step: number) => {
    // Base classes
    let classes = "flex-1 h-0.5 transition-all duration-500 ";
    
    // Complete connector
    if (step < currentStep) {
      classes += "bg-primary";
    }
    // Incomplete connector
    else {
      classes += "bg-gray-200";
    }
    
    return classes;
  };

  // Helper function to render steps separately
  const renderSteps = () => {
    const stepsArray = [];
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      stepsArray.push(
        <div key={`step-${step}`} className="flex flex-col items-center z-10">
          <div 
            className={getStepClasses(step)}
            onClick={() => handleStepClick(step)}
            role={allowNavigation && step <= currentStep ? "button" : undefined}
            tabIndex={allowNavigation && step <= currentStep ? 0 : undefined}
          >
            {step < currentStep ? (
              <Check className="h-5 w-5" />
            ) : (
              step
            )}
          </div>
          
          {/* Step label */}
          <div className="mt-2 text-xs text-center">
            <div className={`font-medium ${step <= currentStep ? 'text-gray-900' : 'text-gray-500'}`}>
              {stepLabels[i]}
            </div>
          </div>
        </div>
      );
    }
    
    return <SafeWrapper>{stepsArray}</SafeWrapper>;
  };
  
  // Helper function to render connectors separately
  const renderConnectors = () => {
    const connectorsArray = [];
    
    for (let i = 0; i < steps.length - 1; i++) {
      const step = steps[i];
      connectorsArray.push(
        <div 
          key={`connector-${step}`} 
          className={getConnectorClasses(step)}
          style={{ width: '100%' }}
        />
      );
    }
    
    return (
      <div className="absolute top-4 left-0 right-0 mx-12 flex">
        <SafeWrapper>{connectorsArray}</SafeWrapper>
      </div>
    );
  };
  
  return (
    <div className="w-full">
      {/* Mobile view - simple text indicator */}
      <div className="md:hidden flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">
          Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
        </span>
        <span className="text-xs font-medium text-gray-400">
          {Math.floor((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      
      {/* Progress bar for mobile */}
      <div className="md:hidden w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      
      {/* Desktop view - full step indicators with labels */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between relative">
          {/* Step indicators and labels */}
          {renderSteps()}
          
          {/* Connector lines */}
          {renderConnectors()}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
