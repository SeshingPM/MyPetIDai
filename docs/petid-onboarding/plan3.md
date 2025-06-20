# Frontend Components for Multi-Step Onboarding (Part 2)

This document continues the implementation plan for the frontend components of the multi-step onboarding flow. It covers the remaining steps: Pet Lifestyle and Account Creation.

## Table of Contents

1. [Step 3: Pet Lifestyle](#step-3-pet-lifestyle)
2. [Step 4: Account Creation](#step-4-account-creation)
3. [Integration with Router](#integration-with-router)
4. [Styling and Responsiveness](#styling-and-responsiveness)
5. [Accessibility Considerations](#accessibility-considerations)

## Step 3: Pet Lifestyle

The third step collects information about the pet's lifestyle, including food, treats, insurance, and medications.

```tsx
// src/components/onboarding/steps/PetLifestyleStep.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OnboardingState } from '../OnboardingFlow';
import { PlusCircle, X } from 'lucide-react';
import { dogMedications, catMedications } from '@/data/pet-medications';
import { dogSupplements, catSupplements } from '@/data/pet-supplements';

interface PetLifestyleStepProps {
  data: OnboardingState['petLifestyle'] & { petType: 'dog' | 'cat' };
  updateData: (data: Partial<OnboardingState['petLifestyle']>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PetLifestyleStep: React.FC<PetLifestyleStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}) => {
  const [newMedication, setNewMedication] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newSupplement, setNewSupplement] = useState('');

  const addMedication = () => {
    if (newMedication.trim()) {
      updateData({
        medications: [...data.medications, { 
          name: newMedication.trim(),
          provider: newProvider.trim() || undefined
        }]
      });
      setNewMedication('');
      setNewProvider('');
    }
  };

  const removeMedication = (index: number) => {
    const updatedMedications = [...data.medications];
    updatedMedications.splice(index, 1);
    updateData({ medications: updatedMedications });
  };

  const addSupplement = () => {
    if (newSupplement.trim()) {
      updateData({
        supplements: [...data.supplements, newSupplement.trim()]
      });
      setNewSupplement('');
    }
  };

  const removeSupplement = (index: number) => {
    const updatedSupplements = [...data.supplements];
    updatedSupplements.splice(index, 1);
    updateData({ supplements: updatedSupplements });
  };

  const isFormValid = () => {
    return data.foodType && data.treats;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Pet's Lifestyle</h1>
        <p className="text-muted-foreground">Tell us about your pet's diet and care</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="food-type">What type of food do they eat?</Label>
          <Input
            id="food-type"
            value={data.foodType}
            onChange={(e) => updateData({ foodType: e.target.value })}
            placeholder="Enter food type"
          />
        </div>

        <div>
          <Label htmlFor="treats">What treats do you give your pet?</Label>
          <Input
            id="treats"
            value={data.treats}
            onChange={(e) => updateData({ treats: e.target.value })}
            placeholder="Enter treats"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="has-insurance"
              checked={data.hasInsurance}
              onCheckedChange={(checked) => updateData({ hasInsurance: checked })}
            />
            <Label htmlFor="has-insurance">Do you have pet insurance?</Label>
          </div>
          
          {data.hasInsurance && (
            <div className="pl-6 pt-2">
              <Label htmlFor="insurance-provider">Insurance Provider</Label>
              <Input
                id="insurance-provider"
                value={data.insuranceProvider}
                onChange={(e) => updateData({ insuranceProvider: e.target.value })}
                placeholder="Enter insurance provider"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Remember to upload your insurance documents later for easy access!
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="on-medications"
              checked={data.onMedications}
              onCheckedChange={(checked) => updateData({ onMedications: checked })}
            />
            <Label htmlFor="on-medications">Is your pet on any medications?</Label>
          </div>
          
          {data.onMedications && (
            <div className="pl-6 pt-2 space-y-3">
              <div className="space-y-2">
                <Label>Current Medications</Label>
                {data.medications.length > 0 ? (
                  <ul className="space-y-2">
                    {data.medications.map((med, index) => (
                      <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <div>
                          <span className="font-medium">{med.name}</span>
                          {med.provider && (
                            <span className="text-sm text-muted-foreground ml-2">
                              Provider: {med.provider}
                            </span>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeMedication(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No medications added yet</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-medication">Add Medication</Label>
                <div className="flex gap-2">
                  <Select
                    value={newMedication}
                    onValueChange={setNewMedication}
                  >
                    <SelectTrigger id="new-medication" className="flex-1">
                      <SelectValue placeholder="Select medication" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.petType === 'dog' ? (
                        dogMedications.map((medication) => (
                          <SelectItem key={medication} value={medication}>
                            {medication}
                          </SelectItem>
                        ))
                      ) : (
                        catMedications.map((medication) => (
                          <SelectItem key={medication} value={medication}>
                            {medication}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={addMedication}
                    disabled={!newMedication.trim()}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  id="new-provider"
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  placeholder="Provider (optional)"
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Supplements</Label>
          {data.supplements.length > 0 ? (
            <ul className="space-y-2">
              {data.supplements.map((supplement, index) => (
                <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span>{supplement}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeSupplement(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No supplements added yet</p>
          )}
          
          <div className="flex gap-2 mt-2">
            <Select
              value={newSupplement}
              onValueChange={setNewSupplement}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select supplement" />
              </SelectTrigger>
              <SelectContent>
                {data.petType === 'dog' ? (
                  dogSupplements.map((supplement) => (
                    <SelectItem key={supplement} value={supplement}>
                      {supplement}
                    </SelectItem>
                  ))
                ) : (
                  catSupplements.map((supplement) => (
                    <SelectItem key={supplement} value={supplement}>
                      {supplement}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={addSupplement}
              disabled={!newSupplement.trim()}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
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

export default PetLifestyleStep;
```

## Step 4: Account Creation

The fourth and final step collects the user's email and password to create an account.

```tsx
// src/components/onboarding/steps/AccountCreationStep.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnboardingState } from '../OnboardingFlow';
import { Loader2 } from 'lucide-react';

interface AccountCreationStepProps {
  data: OnboardingState['accountInfo'];
  updateData: (data: Partial<OnboardingState['accountInfo']>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const AccountCreationStep: React.FC<AccountCreationStepProps> = ({ 
  data, 
  updateData, 
  onSubmit, 
  onBack,
  isSubmitting 
}) => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    updateData({ password: newPassword });
    
    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    
    if (data.password !== newConfirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const isFormValid = () => {
    return (
      validateEmail(data.email) && 
      validatePassword(data.password) && 
      data.password === confirmPassword
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create Your Account</h1>
        <p className="text-muted-foreground">Almost done! Set up your login details</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="Enter your email"
          />
          {data.email && !validateEmail(data.email) && (
            <p className="text-sm text-destructive mt-1">Please enter a valid email address</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={handlePasswordChange}
            placeholder="Create a password"
          />
          {data.password && !validatePassword(data.password) && (
            <p className="text-sm text-destructive mt-1">Password must be at least 6 characters</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm your password"
          />
          {passwordError && (
            <p className="text-sm text-destructive mt-1">{passwordError}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex-1"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={!isFormValid() || isSubmitting} 
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </div>
    </div>
  );
};

export default AccountCreationStep;
```

## Integration with Router

To integrate the onboarding flow with the application's routing system, we'll need to update the router configuration. Here's how to set it up:

```tsx
// src/App.tsx (or your router configuration file)
import { Routes, Route, Navigate } from 'react-router-dom';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
// ... other imports

function App() {
  return (
    <Routes>
      {/* Replace the old Register component with the new OnboardingFlow */}
      <Route path="/register" element={<OnboardingFlow />} />
      
      {/* Keep other routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* ... other routes */}
    </Routes>
  );
}

export default App;
```

## Styling and Responsiveness

The components are designed with Tailwind CSS classes to ensure they are responsive and visually consistent with the rest of the application. Here are some key styling considerations:

1. **Mobile-First Approach**:
   - The main container has a `max-w-md` class to ensure it's not too wide on larger screens
   - Form controls are full-width for better mobile usability
   - Adequate spacing between elements for touch targets

2. **Consistent UI Elements**:
   - Using the same button styles across all steps
   - Consistent form field styling
   - Clear visual hierarchy with headings and supporting text

3. **Visual Feedback**:
   - Disabled states for buttons when form validation fails
   - Loading indicators during submission
   - Error messages for validation issues

4. **Accessibility**:
   - Proper labeling of form controls
   - Sufficient color contrast
   - Focus states for keyboard navigation

## Accessibility Considerations

To ensure the onboarding flow is accessible to all users, we've implemented the following:

1. **Semantic HTML**:
   - Using proper heading levels (`h1`, `h2`, etc.)
   - Form elements with associated labels
   - Button elements for interactive controls

2. **Keyboard Navigation**:
   - All interactive elements are focusable
   - Logical tab order
   - Calendar component is keyboard accessible

3. **Screen Reader Support**:
   - Descriptive labels for form controls
   - Error messages are associated with their respective inputs
   - Status updates (like "Creating account...") are announced

4. **Reduced Motion**:
   - Animations are minimal and used only for essential feedback
   - Progress bar transitions are subtle

5. **Color and Contrast**:
   - Not relying solely on color to convey information
   - Ensuring sufficient contrast for text and UI elements
   - Error states use both color and text to indicate issues

In the next document (plan4.md), we'll cover the backend implementation and integration of the onboarding flow.
