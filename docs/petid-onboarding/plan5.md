# Testing, Deployment, and Future Enhancements

This document outlines the testing strategy, deployment plan, and potential future enhancements for the MyPetID multi-step onboarding flow.

## Table of Contents

1. [Testing Strategy](#testing-strategy)
2. [Deployment Plan](#deployment-plan)
3. [Monitoring and Analytics](#monitoring-and-analytics)
4. [Future Enhancements](#future-enhancements)
5. [Maintenance Considerations](#maintenance-considerations)

## Testing Strategy

A comprehensive testing strategy is essential to ensure the onboarding flow works correctly and provides a good user experience. We'll implement the following testing approaches:

### 1. Unit Testing

Unit tests will focus on testing individual components and functions in isolation:

```typescript
// src/__tests__/utils/pet-id-generator.test.ts
import { generatePetId } from '@/utils/pet-id-generator';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null }),
  },
}));

describe('Pet ID Generator', () => {
  it('generates a pet ID with the correct format', async () => {
    const petId = await generatePetId('dog', 'male', '2023-01-01');
    
    // Check format: DM-23-XXXX
    expect(petId).toMatch(/^DM-23-\d{4}$/);
  });
  
  it('generates a pet ID with the correct type character', async () => {
    const dogId = await generatePetId('dog', 'male', '2023-01-01');
    expect(dogId.charAt(0)).toBe('D');
    
    const catId = await generatePetId('cat', 'male', '2023-01-01');
    expect(catId.charAt(0)).toBe('C');
  });
  
  it('generates a pet ID with the correct gender character', async () => {
    const maleId = await generatePetId('dog', 'male', '2023-01-01');
    expect(maleId.charAt(1)).toBe('M');
    
    const femaleId = await generatePetId('dog', 'female', '2023-01-01');
    expect(femaleId.charAt(1)).toBe('F');
  });
  
  it('generates a pet ID with the correct year code', async () => {
    const id2020 = await generatePetId('dog', 'male', '2020-01-01');
    expect(id2020.substring(3, 5)).toBe('20');
    
    const id2025 = await generatePetId('dog', 'male', '2025-01-01');
    expect(id2025.substring(3, 5)).toBe('25');
  });
  
  it('retries if a collision occurs', async () => {
    // Mock a collision on first attempt, then success
    const mockSingle = jest.fn()
      .mockResolvedValueOnce({ data: { id: 'existing-id' } })
      .mockResolvedValueOnce({ data: null });
    
    (supabase.from as jest.Mock).mockReturnThis();
    (supabase.select as jest.Mock).mockReturnThis();
    (supabase.eq as jest.Mock).mockReturnThis();
    (supabase.single as jest.Mock).mockImplementation(mockSingle);
    
    const petId = await generatePetId('dog', 'male', '2023-01-01');
    
    // Should have called single twice (collision + success)
    expect(mockSingle).toHaveBeenCalledTimes(2);
    expect(petId).toMatch(/^DM-23-\d{4}$/);
  });
});
```

### 2. Component Testing

Component tests will verify that each component renders correctly and handles user interactions properly:

```typescript
// src/__tests__/components/onboarding/steps/PetInfoStep.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PetInfoStep from '@/components/onboarding/steps/PetInfoStep';

describe('PetInfoStep', () => {
  const mockData = {
    name: '',
    type: 'dog' as const,
    breed: '',
    gender: 'male' as const,
    birthOrAdoptionDate: '',
  };
  
  const mockUpdateData = jest.fn();
  const mockOnNext = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders correctly', () => {
    render(
      <PetInfoStep 
        data={mockData} 
        updateData={mockUpdateData} 
        onNext={mockOnNext} 
      />
    );
    
    expect(screen.getByText('Tell us about your pet')).toBeInTheDocument();
    expect(screen.getByLabelText(/Pet's Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dog/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cat/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Breed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Male/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Female/i)).toBeInTheDocument();
    expect(screen.getByText(/Birth or Adoption Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
  });
  
  it('updates data when inputs change', () => {
    render(
      <PetInfoStep 
        data={mockData} 
        updateData={mockUpdateData} 
        onNext={mockOnNext} 
      />
    );
    
    // Test name input
    fireEvent.change(screen.getByLabelText(/Pet's Name/i), {
      target: { value: 'Buddy' },
    });
    expect(mockUpdateData).toHaveBeenCalledWith({ name: 'Buddy' });
    
    // Test breed input
    fireEvent.change(screen.getByLabelText(/Breed/i), {
      target: { value: 'Labrador' },
    });
    expect(mockUpdateData).toHaveBeenCalledWith({ breed: 'Labrador' });
    
    // Test radio buttons
    fireEvent.click(screen.getByLabelText(/Cat/i));
    expect(mockUpdateData).toHaveBeenCalledWith({ type: 'cat' });
    
    fireEvent.click(screen.getByLabelText(/Female/i));
    expect(mockUpdateData).toHaveBeenCalledWith({ gender: 'female' });
  });
  
  it('disables Next button when form is invalid', () => {
    render(
      <PetInfoStep 
        data={mockData} 
        updateData={mockUpdateData} 
        onNext={mockOnNext} 
      />
    );
    
    const nextButton = screen.getByText(/Next/i);
    expect(nextButton).toBeDisabled();
  });
  
  it('enables Next button when form is valid', () => {
    const validData = {
      name: 'Buddy',
      type: 'dog' as const,
      breed: 'Labrador',
      gender: 'male' as const,
      birthOrAdoptionDate: '2023-01-01',
    };
    
    render(
      <PetInfoStep 
        data={validData} 
        updateData={mockUpdateData} 
        onNext={mockOnNext} 
      />
    );
    
    const nextButton = screen.getByText(/Next/i);
    expect(nextButton).not.toBeDisabled();
  });
  
  it('calls onNext when Next button is clicked', () => {
    const validData = {
      name: 'Buddy',
      type: 'dog' as const,
      breed: 'Labrador',
      gender: 'male' as const,
      birthOrAdoptionDate: '2023-01-01',
    };
    
    render(
      <PetInfoStep 
        data={validData} 
        updateData={mockUpdateData} 
        onNext={mockOnNext} 
      />
    );
    
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    expect(mockOnNext).toHaveBeenCalled();
  });
});
```

### 3. Integration Testing

Integration tests will verify that the components work together correctly and that the data flows properly through the onboarding process:

```typescript
// src/__tests__/integration/OnboardingFlow.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { supabase } from '@/integrations/supabase/client';
import { signUp } from '@/contexts/auth/operations';
import { createPetWithOnboardingData } from '@/contexts/pets/api';

// Mock dependencies
jest.mock('@/integrations/supabase/client');
jest.mock('@/contexts/auth/operations');
jest.mock('@/contexts/pets/api');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('OnboardingFlow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful signup
    (signUp as jest.Mock).mockResolvedValue({
      success: true,
      user: { id: 'test-user-id' },
    });
    
    // Mock successful pet creation
    (createPetWithOnboardingData as jest.Mock).mockResolvedValue({
      id: 'test-pet-id',
      petIdentifier: 'DM-23-1234',
    });
  });
  
  it('completes the full onboarding flow', async () => {
    render(
      <MemoryRouter>
        <OnboardingFlow />
      </MemoryRouter>
    );
    
    // Step 1: Pet Info
    expect(screen.getByText('Tell us about your pet')).toBeInTheDocument();
    
    // Fill out pet info
    fireEvent.change(screen.getByLabelText(/Pet's Name/i), {
      target: { value: 'Buddy' },
    });
    fireEvent.click(screen.getByLabelText(/Dog/i));
    fireEvent.change(screen.getByLabelText(/Breed/i), {
      target: { value: 'Labrador' },
    });
    fireEvent.click(screen.getByLabelText(/Male/i));
    
    // Mock date selection (simplified for test)
    fireEvent.click(screen.getByText(/Select date/i));
    const dateButton = screen.getByRole('button', { name: /15/i });
    fireEvent.click(dateButton);
    
    // Move to next step
    fireEvent.click(screen.getByText('Next'));
    
    // Step 2: Owner Info
    await waitFor(() => {
      expect(screen.getByText('Who is the human?')).toBeInTheDocument();
    });
    
    // Fill out owner info
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Zip Code/i), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '555-123-4567' },
    });
    fireEvent.click(screen.getByLabelText(/Receive SMS alerts/i));
    
    // Move to next step
    fireEvent.click(screen.getByText('Next'));
    
    // Step 3: Pet Lifestyle
    await waitFor(() => {
      expect(screen.getByText("Pet's Lifestyle")).toBeInTheDocument();
    });
    
    // Fill out lifestyle info
    fireEvent.change(screen.getByLabelText(/What type of food/i), {
      target: { value: 'Dry kibble' },
    });
    fireEvent.change(screen.getByLabelText(/What treats/i), {
      target: { value: 'Dental chews' },
    });
    fireEvent.click(screen.getByLabelText(/Do you have pet insurance/i));
    
    // Insurance provider should appear
    const insuranceInput = screen.getByLabelText(/Insurance Provider/i);
    fireEvent.change(insuranceInput, {
      target: { value: 'PetCare Plus' },
    });
    
    // Add medication
    fireEvent.click(screen.getByLabelText(/Is your pet on any medications/i));
    fireEvent.change(screen.getByPlaceholderText(/Medication name/i), {
      target: { value: 'Heartworm prevention' },
    });
    fireEvent.click(screen.getByRole('button', { name: '' })); // Add medication button
    
    // Add supplement
    fireEvent.change(screen.getByPlaceholderText(/Add a supplement/i), {
      target: { value: 'Glucosamine' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: '' })[1]); // Add supplement button
    
    // Move to next step
    fireEvent.click(screen.getByText('Next'));
    
    // Step 4: Account Creation
    await waitFor(() => {
      expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    });
    
    // Fill out account info
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password123' },
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Create Account'));
    
    // Verify API calls
    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith(
        'john.doe@example.com',
        'password123',
        expect.objectContaining({
          full_name: 'John Doe',
        })
      );
      
      expect(createPetWithOnboardingData).toHaveBeenCalledWith(
        'test-user-id',
        expect.objectContaining({
          name: 'Buddy',
          type: 'dog',
          breed: 'Labrador',
          gender: 'male',
        }),
        expect.objectContaining({
          fullName: 'John Doe',
          zipCode: '12345',
          phone: '555-123-4567',
          smsOptIn: true,
        }),
        expect.objectContaining({
          foodType: 'Dry kibble',
          treats: 'Dental chews',
          hasInsurance: true,
          insuranceProvider: 'PetCare Plus',
          onMedications: true,
        })
      );
    });
  });
  
  it('handles validation errors', async () => {
    render(
      <MemoryRouter>
        <OnboardingFlow />
      </MemoryRouter>
    );
    
    // Try to proceed without filling required fields
    fireEvent.click(screen.getByText('Next'));
    
    // Next button should be disabled
    expect(screen.getByText('Next')).toBeDisabled();
    
    // Fill only some fields
    fireEvent.change(screen.getByLabelText(/Pet's Name/i), {
      target: { value: 'Buddy' },
    });
    
    // Next button should still be disabled
    expect(screen.getByText('Next')).toBeDisabled();
  });
  
  it('handles API errors', async () => {
    // Mock API error
    (signUp as jest.Mock).mockResolvedValue({
      success: false,
      error: {
        message: 'Email already in use',
      },
    });
    
    render(
      <MemoryRouter>
        <OnboardingFlow />
      </MemoryRouter>
    );
    
    // Complete all steps (simplified)
    // ... (fill out all forms)
    
    // Submit form
    fireEvent.click(screen.getByText('Create Account'));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeInTheDocument();
    });
  });
});
```

### 4. End-to-End Testing

End-to-end tests will verify the complete user journey from registration to dashboard:

```typescript
// cypress/e2e/onboarding.cy.ts
describe('Onboarding Flow', () => {
  beforeEach(() => {
    // Set up test database state
    cy.task('resetTestDatabase');
    
    // Visit the registration page
    cy.visit('/register');
  });
  
  it('completes the onboarding process successfully', () => {
    // Step 1: Pet Info
    cy.contains('Tell us about your pet').should('be.visible');
    
    cy.get('input[id="pet-name"]').type('Buddy');
    cy.get('input[id="dog"]').check();
    cy.get('input[id="pet-breed"]').type('Labrador');
    cy.get('input[id="male"]').check();
    
    // Select date
    cy.get('button').contains('Select date').click();
    cy.get('.rdp-day').contains('15').click();
    
    cy.get('button').contains('Next').click();
    
    // Step 2: Owner Info
    cy.contains('Who is the human?').should('be.visible');
    
    cy.get('input[id="full-name"]').type('John Doe');
    cy.get('input[id="zip-code"]').type('12345');
    cy.get('input[id="phone"]').type('555-123-4567');
    cy.get('input[id="sms-opt-in"]').check();
    
    cy.get('button').contains('Next').click();
    
    // Step 3: Pet Lifestyle
    cy.contains("Pet's Lifestyle").should('be.visible');
    
    cy.get('input[id="food-type"]').type('Dry kibble');
    cy.get('input[id="treats"]').type('Dental chews');
    cy.get('input[id="has-insurance"]').check();
    cy.get('input[id="insurance-provider"]').type('PetCare Plus');
    
    cy.get('input[id="on-medications"]').check();
    cy.get('input[placeholder="Medication name"]').type('Heartworm prevention');
    cy.get('button').contains('Add Medication').click();
    
    cy.get('input[placeholder="Add a supplement"]').type('Glucosamine');
    cy.get('button').contains('Add Supplement').click();
    
    cy.get('button').contains('Next').click();
    
    // Step 4: Account Creation
    cy.contains('Create Your Account').should('be.visible');
    
    // Generate a unique email for testing
    const email = `test-${Date.now()}@example.com`;
    
    cy.get('input[id="email"]').type(email);
    cy.get('input[id="password"]').type('password123');
    cy.get('input[id="confirm-password"]').type('password123');
    
    cy.get('button').contains('Create Account').click();
    
    // Verify success and redirect to dashboard
    cy.contains('Welcome to MyPetID!').should('be.visible');
    cy.contains(/Your Pet ID is [A-Z]{2}-\d{2}-\d{4}/i).should('be.visible');
    
    // Should be redirected to dashboard
    cy.url().should('include', '/dashboard');
    
    // Verify pet data is displayed on dashboard
    cy.contains('Buddy').should('be.visible');
    cy.contains('Labrador').should('be.visible');
  });
  
  it('validates form inputs', () => {
    // Try to proceed without filling required fields
    cy.get('button').contains('Next').should('be.disabled');
    
    // Fill only some fields
    cy.get('input[id="pet-name"]').type('Buddy');
    
    // Button should still be disabled
    cy.get('button').contains('Next').should('be.disabled');
    
    // Fill all required fields
    cy.get('input[id="dog"]').check();
    cy.get('input[id="pet-breed"]').type('Labrador');
    cy.get('input[id="male"]').check();
    
    // Select date
    cy.get('button').contains('Select date').click();
    cy.get('.rdp-day').contains('15').click();
    
    // Button should now be enabled
    cy.get('button').contains('Next').should('not.be.disabled');
  });
  
  it('handles back navigation between steps', () => {
    // Complete step 1
    cy.get('input[id="pet-name"]').type('Buddy');
    cy.get('input[id="dog"]').check();
    cy.get('input[id="pet-breed"]').type('Labrador');
    cy.get('input[id="male"]').check();
    cy.get('button').contains('Select date').click();
    cy.get('.rdp-day').contains('15').click();
    cy.get('button').contains('Next').click();
    
    // Step 2 should be visible
    cy.contains('Who is the human?').should('be.visible');
    
    // Go back to step 1
    cy.get('button').contains('Back').click();
    
    // Step 1 should be visible again with data preserved
    cy.contains('Tell us about your pet').should('be.visible');
    cy.get('input[id="pet-name"]').should('have.value', 'Buddy');
    cy.get('input[id="pet-breed"]').should('have.value', 'Labrador');
  });
});
```

### 5. Accessibility Testing

We'll use tools like axe-core to test for accessibility issues:

```typescript
// cypress/e2e/accessibility.cy.ts
describe('Onboarding Flow Accessibility', () => {
  beforeEach(() => {
    cy.visit('/register');
    cy.injectAxe();
  });
  
  it('Step 1: Pet Info has no accessibility violations', () => {
    cy.contains('Tell us about your pet').should('be.visible');
    cy.checkA11y();
  });
  
  it('Step 2: Owner Info has no accessibility violations', () => {
    // Complete step 1
    cy.get('input[id="pet-name"]').type('Buddy');
    cy.get('input[id="dog"]').check();
    cy.get('input[id="pet-breed"]').type('Labrador');
    cy.get('input[id="male"]').check();
    cy.get('button').contains('Select date').click();
    cy.get('.rdp-day').contains('15').click();
    cy.get('button').contains('Next').click();
    
    cy.contains('Who is the human?').should('be.visible');
    cy.checkA11y();
  });
  
  it('Step 3: Pet Lifestyle has no accessibility violations', () => {
    // Complete steps 1 and 2
    // ...
    
    cy.contains("Pet's Lifestyle").should('be.visible');
    cy.checkA11y();
    
    // Check with expanded sections
    cy.get('input[id="has-insurance"]').check();
    cy.get('input[id="on-medications"]').check();
    cy.checkA11y();
  });
  
  it('Step 4: Account Creation has no accessibility violations', () => {
    // Complete steps 1, 2, and 3
    // ...
    
    cy.contains('Create Your Account').should('be.visible');
    cy.checkA11y();
    
    // Check with validation errors
    cy.get('input[id="email"]').type('invalid-email');
    cy.get('input[id="email"]').blur();
    cy.checkA11y();
  });
});
```

## Deployment Plan

The deployment of the multi-step onboarding flow will be done in phases to minimize risk and ensure a smooth transition.

### Phase 1: Development and Testing

1. **Development Environment Setup**:
   - Set up the database schema in the development environment
   - Implement the frontend components
   - Implement the backend API functions
   - Implement the Pet ID generation logic

2. **Testing**:
   - Run unit tests for individual components and functions
   - Run integration tests for the complete flow
   - Run end-to-end tests to verify the user journey
   - Run accessibility tests to ensure the flow is accessible

### Phase 2: Staging Deployment

1. **Database Migration**:
   - Apply the database migrations to the staging environment
   - Verify the database schema is correct

2. **Frontend Deployment**:
   - Deploy the frontend components to the staging environment
   - Verify the components render correctly

3. **Backend Deployment**:
   - Deploy the backend API functions to the staging environment
   - Verify the API functions work correctly

4. **User Acceptance Testing**:
   - Have stakeholders test the complete flow
   - Gather feedback and make necessary adjustments

### Phase 3: Production Deployment

1. **Database Migration**:
   - Apply the database migrations to the production environment
   - Verify the database schema is correct

2. **Frontend Deployment**:
   - Deploy the frontend components to the production environment
   - Verify the components render correctly

3. **Backend Deployment**:
   - Deploy the backend API functions to the production environment
   - Verify the API functions work correctly

4. **Monitoring**:
   - Set up monitoring for the onboarding flow
   - Monitor for errors and performance issues

### Phase 4: Post-Deployment

1. **User Feedback**:
   - Gather feedback from users
   - Make necessary adjustments based on feedback

2. **Performance Optimization**:
   - Analyze performance metrics
   - Optimize slow-performing parts of the flow

## Monitoring and Analytics

To ensure the onboarding flow is working correctly and to gather insights for future improvements, we'll implement the following monitoring and analytics:

### 1. Error Monitoring

We'll use error tracking tools to monitor for errors in the onboarding flow:

```typescript
// src/utils/error-tracking.ts
import * as Sentry from '@sentry/react';

export function initErrorTracking() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  });
}

export function trackError(error: Error, context: Record<string, any> = {}) {
  Sentry.captureException(error, {
    tags: {
      component: 'OnboardingFlow',
    },
    extra: context,
  });
}
```

### 2. User Analytics

We'll track user interactions with the onboarding flow to gather insights:

```typescript
// src/utils/analytics.ts
import posthog from 'posthog-js';

export function initAnalytics() {
  posthog.init(process.env.POSTHOG_API_KEY, {
    api_host: process.env.POSTHOG_HOST,
  });
}

export function trackOnboardingStep(step: number, data: Record<string, any> = {}) {
  posthog.capture('onboarding_step_viewed', {
    step,
    ...data,
  });
}

export function trackOnboardingCompletion(petId: string, data: Record<string, any> = {}) {
  posthog.capture('onboarding_completed', {
    petId,
    ...data,
  });
}

export function trackOnboardingAbandonment(step: number, data: Record<string, any> = {}) {
  posthog.capture('onboarding_abandoned', {
    step,
    ...data,
  });
}
```

### 3. Performance Monitoring

We'll monitor the performance of the onboarding flow to identify bottlenecks:

```typescript
// src/utils/performance.ts
import { performance, PerformanceObserver } from 'perf_hooks';

export function initPerformanceMonitoring() {
  const obs = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
      console.log(`${entry.name}: ${entry.duration}ms`);
      
      // Send to analytics
      posthog.capture('performance_metric', {
        name: entry.name,
        duration: entry.duration,
      });
    });
  });
  
  obs.observe({ entryTypes: ['measure'] });
}

export function measureOnboardingStep(step: number) {
  const startMark = `onboarding_step_${step}_start`;
  const endMark = `onboarding_step_${step}_end`;
  const measureName = `onboarding_step_${step}`;
  
  performance.mark(startMark);
  
  return {
    end: () => {
      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
    },
  };
}
```

## Future Enhancements

Based on user feedback and business requirements, we can consider the following enhancements to the onboarding flow:

### 1. Multiple Pets Support

Allow users to add multiple pets during the onboarding process:

```typescript
// src/components/onboarding/OnboardingFlow.tsx
// ... existing code ...

const [pets, setPets] = useState<Array<OnboardingState['petInfo']>>([]);
const [currentPetIndex, setCurrentPetIndex] = useState(0);

const addAnotherPet = () => {
  setPets([...pets, {
    name: '',
    type: 'dog',
    breed: '',
    gender: 'male',
    birthOrAdoptionDate: '',
  }]);
  setCurrentPetIndex(pets.length);
  setState(prev => ({
    ...prev,
    currentStep: 1, // Go back to step 1 for the new pet
    petInfo: {
      name: '',
      type: 'dog',
      breed: '',
      gender: 'male',
      birthOrAdoptionDate: '',
    },
  }));
};

// ... existing code ...
```

### 2. Social Media Integration

Allow users to share their pet's profile on social media:

```typescript
// src/components/onboarding/steps/CompletionStep.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';

interface CompletionStepProps {
  petName: string;
  petId: string;
  onDashboard: () => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ 
  petName, 
  petId, 
  onDashboard 
}) => {
  const shareOnSocialMedia = (platform: 'facebook' | 'twitter' | 'instagram
