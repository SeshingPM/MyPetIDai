# Frontend Components for Multi-Step Onboarding (Part 1)

This document outlines the frontend components needed for the multi-step onboarding flow. It covers the main container component, state management, and the first two steps of the onboarding process.

## Table of Contents

1. [Component Structure](#component-structure)
2. [State Management](#state-management)
3. [Main Container Component](#main-container-component)
4. [Progress Bar Component](#progress-bar-component)
5. [Step 1: Pet Info](#step-1-pet-info)
6. [Step 2: Owner Info](#step-2-owner-info)

## Component Structure

The multi-step onboarding flow will be organized into the following component structure:

```
src/
└── components/
    └── onboarding/
        ├── OnboardingFlow.tsx       # Main container component
        ├── ProgressBar.tsx          # Progress indicator
        └── steps/
            ├── PetInfoStep.tsx      # Step 1: Pet information
            ├── OwnerInfoStep.tsx    # Step 2: Owner information
            ├── PetLifestyleStep.tsx # Step 3: Pet lifestyle
            └── AccountCreationStep.tsx # Step 4: Account creation
```

## State Management

We'll use React's useState hook to manage the state of the onboarding flow. The state will be structured as follows:

```typescript
// Define the state structure for the entire onboarding process
export interface OnboardingState {
  currentStep: number;
  petInfo: {
    name: string;
    type: 'dog' | 'cat';
    breed: string;
    gender: 'male' | 'female';
    birthOrAdoptionDate: string;
    photoFile?: File;
  };
  ownerInfo: {
    fullName: string;
    zipCode: string;
    phone: string;
    smsOptIn: boolean;
  };
  petLifestyle: {
    foodType: string;
    treats: string;
    hasInsurance: boolean;
    insuranceProvider: string;
    onMedications: boolean;
    medications: Array<{name: string, provider?: string}>;
    supplements: string[];
  };
  accountInfo: {
    email: string;
    password: string;
  };
}
```

## Main Container Component

The main container component will manage the state and navigation between steps.

```tsx
// src/components/onboarding/OnboardingFlow.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PetInfoStep from './steps/PetInfoStep';
import OwnerInfoStep from './steps/OwnerInfoStep';
import PetLifestyleStep from './steps/PetLifestyleStep';
import AccountCreationStep from './steps/AccountCreationStep';
import ProgressBar from './ProgressBar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the state structure for the entire onboarding process
export interface OnboardingState {
  currentStep: number;
  petInfo: {
    name: string;
    type: 'dog' | 'cat';
    breed: string;
    gender: 'male' | 'female';
    birthOrAdoptionDate: string;
    photoFile?: File;
  };
  ownerInfo: {
    fullName: string;
    zipCode: string;
    phone: string;
    smsOptIn: boolean;
  };
  petLifestyle: {
    foodType: string;
    treats: string;
    hasInsurance: boolean;
    insuranceProvider: string;
    onMedications: boolean;
    medications: Array<{name: string, provider?: string}>;
    supplements: string[];
  };
  accountInfo: {
    email: string;
    password: string;
  };
}

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState<OnboardingState>({
    currentStep: 1,
    petInfo: {
      name: '',
      type: 'dog',
      breed: '',
      gender: 'male',
      birthOrAdoptionDate: '',
    },
    ownerInfo: {
      fullName: '',
      zipCode: '',
      phone: '',
      smsOptIn: false,
    },
    petLifestyle: {
      foodType: '',
      treats: '',
      hasInsurance: false,
      insuranceProvider: '',
      onMedications: false,
      medications: [],
      supplements: [],
    },
    accountInfo: {
      email: '',
      password: '',
    },
  });

  const nextStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 4)
    }));
  };

  const prevStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1)
    }));
  };

  const updatePetInfo = (data: Partial<OnboardingState['petInfo']>) => {
    setState(prev => ({
      ...prev,
      petInfo: { ...prev.petInfo, ...data }
    }));
  };

  const updateOwnerInfo = (data: Partial<OnboardingState['ownerInfo']>) => {
    setState(prev => ({
      ...prev,
      ownerInfo: { ...prev.ownerInfo, ...data }
    }));
  };

  const updatePetLifestyle = (data: Partial<OnboardingState['petLifestyle']>) => {
    setState(prev => ({
      ...prev,
      petLifestyle: { ...prev.petLifestyle, ...data }
    }));
  };

  const updateAccountInfo = (data: Partial<OnboardingState['accountInfo']>) => {
    setState(prev => ({
      ...prev,
      accountInfo: { ...prev.accountInfo, ...data }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Show generating Pet ID message
      toast.info("Generating unique Pet ID...");
      
      // Implementation details will be covered in plan4.md
      // This is a placeholder for the submission logic
      
      // Success! Redirect to dashboard
      toast.success(`Welcome to MyPetID! Your Pet ID is [Generated ID]`);
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error(`Error during registration: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <PetInfoStep 
            data={state.petInfo} 
            updateData={updatePetInfo} 
            onNext={nextStep} 
          />
        );
      case 2:
        return (
          <OwnerInfoStep 
            data={state.ownerInfo} 
            updateData={updateOwnerInfo} 
            onNext={nextStep} 
            onBack={prevStep} 
          />
        );
      case 3:
        return (
          <PetLifestyleStep 
            data={{ ...state.petLifestyle, petType: state.petInfo.type }} 
            updateData={updatePetLifestyle} 
            onNext={nextStep} 
            onBack={prevStep} 
          />
        );
      case 4:
        return (
          <AccountCreationStep 
            data={state.accountInfo} 
            updateData={updateAccountInfo} 
            onSubmit={handleSubmit} 
            onBack={prevStep}
            isSubmitting={isSubmitting} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <ProgressBar currentStep={state.currentStep} totalSteps={4} />
      {renderStep()}
    </div>
  );
};

export default OnboardingFlow;
```

## Progress Bar Component

The progress bar component will show the user's progress through the onboarding flow.

```tsx
// src/components/onboarding/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div 
              key={stepNumber}
              className={`flex flex-col items-center ${isActive ? 'text-primary' : isCompleted ? 'text-primary/70' : 'text-gray-400'}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                  ${isActive ? 'bg-primary text-white' : 
                    isCompleted ? 'bg-primary/20 text-primary' : 
                    'bg-gray-200 text-gray-500'}`}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span className="text-xs">
                {stepNumber === 1 ? 'Pet Info' : 
                 stepNumber === 2 ? 'Owner Info' : 
                 stepNumber === 3 ? 'Lifestyle' : 
                 'Account'}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
```

## Step 1: Pet Info

The first step collects basic information about the pet.

```tsx
// src/components/onboarding/steps/PetInfoStep.tsx
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { OnboardingState } from '../OnboardingFlow';
import { dogBreeds, catBreeds } from '@/data/pet-breeds';

interface PetInfoStepProps {
  data: OnboardingState['petInfo'];
  updateData: (data: Partial<OnboardingState['petInfo']>) => void;
  onNext: () => void;
}

const PetInfoStep: React.FC<PetInfoStepProps> = ({ data, updateData, onNext }) => {
  const [date, setDate] = React.useState<Date | undefined>(
    data.birthOrAdoptionDate ? new Date(data.birthOrAdoptionDate) : undefined
  );
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      updateData({ birthOrAdoptionDate: format(selectedDate, 'yyyy-MM-dd') });
    }
    setCalendarOpen(false);
  };

  const isFormValid = () => {
    return data.name && data.type && data.breed && data.gender && data.birthOrAdoptionDate;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Tell us about your pet</h1>
        <p className="text-muted-foreground">Let's start with some basic information</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="pet-name">Pet's Name</Label>
          <Input
            id="pet-name"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="Enter your pet's name"
          />
        </div>

        <div>
          <Label>Animal Type</Label>
          <RadioGroup
            value={data.type}
            onValueChange={(value: 'dog' | 'cat') => updateData({ type: value })}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dog" id="dog" />
              <Label htmlFor="dog">Dog</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cat" id="cat" />
              <Label htmlFor="cat">Cat</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="pet-breed">Breed</Label>
          <Select
            value={data.breed}
            onValueChange={(value) => updateData({ breed: value })}
          >
            <SelectTrigger id="pet-breed">
              <SelectValue placeholder="Select your pet's breed" />
            </SelectTrigger>
            <SelectContent>
              {data.type === 'dog' ? (
                dogBreeds.map((breed) => (
                  <SelectItem key={breed} value={breed}>
                    {breed}
                  </SelectItem>
                ))
              ) : (
                catBreeds.map((breed) => (
                  <SelectItem key={breed} value={breed}>
                    {breed}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Gender</Label>
          <RadioGroup
            value={data.gender}
            onValueChange={(value: 'male' | 'female') => updateData({ gender: value })}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="birth-date">Birth or Adoption Date</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => setCalendarOpen(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button 
        onClick={onNext} 
        disabled={!isFormValid()} 
        className="w-full"
      >
        Next
      </Button>
    </div>
  );
};

export default PetInfoStep;
```

## Step 2: Owner Info

The second step collects information about the pet owner.

```tsx
// src/components/onboarding/steps/OwnerInfoStep.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { OnboardingState } from '../OnboardingFlow';

interface OwnerInfoStepProps {
  data: OnboardingState['ownerInfo'];
  updateData: (data: Partial<OnboardingState['ownerInfo']>) => void;
  onNext: () => void;
  onBack: () => void;
}

const OwnerInfoStep: React.FC<OwnerInfoStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}) => {
  const isFormValid = () => {
    return data.fullName && data.zipCode;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Who is the human?</h1>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="full-name">Full Name</Label>
          <Input
            id="full-name"
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <Label htmlFor="zip-code">Zip Code</Label>
          <Input
            id="zip-code"
            value={data.zipCode}
            onChange={(e) => updateData({ zipCode: e.target.value })}
            placeholder="Enter your zip code"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="sms-opt-in"
            checked={data.smsOptIn}
            onCheckedChange={(checked) => updateData({ smsOptIn: checked })}
          />
          <Label htmlFor="sms-opt-in">Receive SMS alerts (optional)</Label>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isFormValid()} 
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default OwnerInfoStep;
```

In the next document (plan3.md), we'll cover the remaining steps of the onboarding flow: Pet Lifestyle and Account Creation.
