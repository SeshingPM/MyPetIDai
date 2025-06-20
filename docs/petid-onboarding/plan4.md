# Backend Implementation and Integration

This document outlines the backend implementation and integration for the MyPetID multi-step onboarding flow. It covers the API endpoints, data handling, and integration with the frontend components.

## Table of Contents

1. [Backend Data Flow](#backend-data-flow)
2. [API Implementation](#api-implementation)
3. [Pet ID Generation](#pet-id-generation)
4. [Data Validation](#data-validation)
5. [Error Handling](#error-handling)
6. [Integration with Frontend](#integration-with-frontend)

## Backend Data Flow

The backend data flow for the onboarding process follows these steps:

1. User completes the multi-step form
2. Frontend submits all collected data to the backend
3. Backend creates user account
4. Backend creates owner profile
5. Backend creates pet record (without pet_identifier initially)
6. Backend generates unique Pet ID
7. Backend updates pet record with pet_identifier
8. Backend creates pet profile, medications, and supplements records
9. Backend returns success response with the generated Pet ID

This process ensures that all data is properly stored and relationships are established between the various entities.

## API Implementation

### 1. Update Auth Context and Operations

First, we need to modify the existing authentication operations to support the new onboarding flow. We'll update the `signUp` function in `src/contexts/auth/operations.ts`:

```typescript
// src/contexts/auth/operations.ts
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { AuthResult } from './types';

// ... existing code ...

export async function signUp(
  email: string,
  password: string,
  userData: UserMetadata
): Promise<AuthResult> {
  try {
    // Format user metadata
    const userMetadata: UserMetadata = {
      full_name: userData.name || "",
      ...userData,
    };

    // Construct the redirect URL for email verification to go to the verification handler
    const verifyHandlerUrl = `${window.location.origin}/verify-handler`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata,
        emailRedirectTo: verifyHandlerUrl,
      },
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    return {
      success: true,
      session: data.session,
      user: data.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || "An error occurred during sign up",
      },
    };
  }
}

// ... existing code ...
```

### 2. Create API Functions for Pet and Related Data

Next, we'll create functions to handle the creation of pets and related data. We'll add these to the pets API file:

```typescript
// src/contexts/pets/api.ts
import { supabase } from '@/integrations/supabase/client';
import { Pet, NewPetData } from './types';

// ... existing code ...

// Create a new pet with complete onboarding data
export const createPetWithOnboardingData = async (
  userId: string,
  petData: {
    name: string;
    type: 'dog' | 'cat';
    breed: string;
    gender: 'male' | 'female';
    birthOrAdoptionDate: string;
    photoFile?: File;
  },
  ownerData: {
    fullName: string;
    zipCode: string;
    phone: string;
    smsOptIn: boolean;
  },
  lifestyleData: {
    foodType: string;
    treats: string;
    hasInsurance: boolean;
    insuranceProvider: string;
    onMedications: boolean;
    medications: Array<{name: string, provider?: string}>;
    supplements: string[];
  }
) => {
  try {
    // Start a transaction
    const { data: ownerProfile, error: ownerError } = await supabase
      .from('owner_profiles')
      .insert({
        user_id: userId,
        full_name: ownerData.fullName,
        zip_code: ownerData.zipCode,
        phone: ownerData.phone,
        sms_opt_in: ownerData.smsOptIn
      })
      .select();
      
    if (ownerError) throw ownerError;
    
    let photoUrl = '';
    
    // Upload photo if provided
    if (petData.photoFile) {
      const fileExt = petData.photoFile.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('pet-photos')
        .upload(filePath, petData.photoFile);
        
      if (uploadError) {
        console.error('Error uploading pet photo:', uploadError);
        throw uploadError;
      }
      
      // Get a signed URL that will work with private buckets
      const { data: urlData } = await supabase.storage
        .from('pet-photos')
        .createSignedUrl(filePath, 60 * 60 * 24); // 1 day expiry
      
      if (!urlData) {
        throw new Error('Failed to create signed URL for pet photo');
      }
        
      photoUrl = urlData.signedUrl;
    }

    // Insert pet data into database (without pet_identifier initially)
    const { data: newPet, error: petError } = await supabase
      .from('pets')
      .insert({
        user_id: userId,
        name: petData.name,
        type: petData.type,
        breed: petData.breed,
        gender: petData.gender,
        birth_or_adoption_date: petData.birthOrAdoptionDate,
        photo_url: photoUrl,
        pet_identifier: '', // Will be updated after generation
        archived: false
      })
      .select()
      .single();

    if (petError) {
      console.error('Error inserting pet data:', petError);
      throw petError;
    }

    if (!newPet) {
      throw new Error('No pet data returned from the database');
    }
    
    // Generate Pet ID
    const petId = await generatePetId(
      petData.type,
      petData.gender,
      petData.birthOrAdoptionDate
    );
    
    // Update pet with pet_identifier
    const { error: updateError } = await supabase
      .from('pets')
      .update({ pet_identifier: petId })
      .eq('id', newPet.id);
      
    if (updateError) throw updateError;
    
    // Create pet profile
    const { error: profileError } = await supabase
      .from('pet_profiles')
      .insert({
        pet_id: newPet.id,
        food_type: lifestyleData.foodType,
        treats: lifestyleData.treats,
        has_insurance: lifestyleData.hasInsurance,
        insurance_provider: lifestyleData.hasInsurance ? lifestyleData.insuranceProvider : null,
        on_medications: lifestyleData.onMedications
      });
      
    if (profileError) throw profileError;
    
    // Create pet supplements if any
    if (lifestyleData.supplements.length > 0) {
      const supplementRecords = lifestyleData.supplements.map(name => ({
        pet_id: newPet.id,
        supplement_name: name
      }));
      
      const { error: supplementsError } = await supabase
        .from('pet_supplements')
        .insert(supplementRecords);
        
      if (supplementsError) throw supplementsError;
    }
    
    // Create pet medications if any
    if (lifestyleData.onMedications && lifestyleData.medications.length > 0) {
      const medicationRecords = lifestyleData.medications.map(med => ({
        pet_id: newPet.id,
        medication_name: med.name,
        provider: med.provider || null
      }));
      
      const { error: medicationsError } = await supabase
        .from('pet_medications')
        .insert(medicationRecords);
        
      if (medicationsError) throw medicationsError;
    }

    // Return the complete pet data with the generated ID
    return {
      ...newPet,
      petIdentifier: petId
    };
  } catch (error) {
    console.error('Error in createPetWithOnboardingData:', error);
    throw error;
  }
};

// ... existing code ...
```

## Pet ID Generation

### Client-Side Implementation

We'll implement the Pet ID generation function on the client side to generate unique IDs:

```typescript
// src/utils/pet-id-generator.ts
import { supabase } from '@/integrations/supabase/client';

/**
 * Generates a unique pet ID in the format DM-20-0420
 * D/C: Pet type (Dog/Cat)
 * M/F: Gender (Male/Female)
 * 20: Last two digits of birth/adoption year
 * 0420: Random 4-digit number (must be unique)
 */
export async function generatePetId(
  petType: 'dog' | 'cat',
  gender: 'male' | 'female',
  birthDate: string
): Promise<string> {
  const typeChar = petType === 'dog' ? 'D' : 'C';
  const genderChar = gender === 'male' ? 'M' : 'F';
  const yearCode = new Date(birthDate).getFullYear().toString().slice(-2);
  
  let isUnique = false;
  let petId = '';
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isUnique && attempts < maxAttempts) {
    // Generate random 4-digit code
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    petId = `${typeChar}${genderChar}-${yearCode}-${randomCode}`;
    
    // Check if this ID already exists
    const { data } = await supabase
      .from('pets')
      .select('id')
      .eq('pet_identifier', petId)
      .single();
    
    isUnique = !data;
    attempts++;
  }
  
  if (!isUnique) {
    throw new Error('Could not generate a unique pet ID after multiple attempts');
  }
  
  return petId;
}
```

### Server-Side Implementation

The server-side implementation is handled by the PostgreSQL function we defined in the migration file `20250322000016_pet_id_generation.sql`. This function is used by the trigger to automatically generate a pet ID when a new pet is inserted without a pet_identifier.

## Data Validation

To ensure data integrity, we'll implement validation for the onboarding data:

```typescript
// src/utils/validation.ts
import { z } from 'zod';

// Pet Info Validation Schema
export const petInfoSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  type: z.enum(['dog', 'cat'], { 
    errorMap: () => ({ message: 'Please select a pet type' }) 
  }),
  breed: z.string().min(1, 'Breed is required'),
  gender: z.enum(['male', 'female'], { 
    errorMap: () => ({ message: 'Please select a gender' }) 
  }),
  birthOrAdoptionDate: z.string().min(1, 'Birth or adoption date is required'),
  photoFile: z.any().optional(),
});

// Owner Info Validation Schema
export const ownerInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  phone: z.string().optional(),
  smsOptIn: z.boolean().default(false),
});

// Pet Lifestyle Validation Schema
export const petLifestyleSchema = z.object({
  foodType: z.string().min(1, 'Food type is required'),
  treats: z.string().min(1, 'Treats information is required'),
  hasInsurance: z.boolean().default(false),
  insuranceProvider: z.string().optional(),
  onMedications: z.boolean().default(false),
  medications: z.array(
    z.object({
      name: z.string().min(1),
      provider: z.string().optional(),
    })
  ).default([]),
  supplements: z.array(z.string()).default([]),
});

// Account Info Validation Schema
export const accountInfoSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Complete Onboarding Data Validation Schema
export const onboardingSchema = z.object({
  petInfo: petInfoSchema,
  ownerInfo: ownerInfoSchema,
  petLifestyle: petLifestyleSchema,
  accountInfo: accountInfoSchema,
});

// Validation function
export function validateOnboardingData(data: any) {
  return onboardingSchema.safeParse(data);
}
```

## Error Handling

We'll implement comprehensive error handling to ensure a smooth user experience:

```typescript
// src/utils/error-handling.ts
import { toast } from 'sonner';
import logger from '@/utils/logger';

// Error types
export enum ErrorType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  PET_ID_GENERATION = 'pet_id_generation',
  FILE_UPLOAD = 'file_upload',
  NETWORK = 'network',
  UNKNOWN = 'unknown',
}

// Error handler function
export function handleOnboardingError(error: any, errorType: ErrorType = ErrorType.UNKNOWN) {
  // Log the error
  logger.error(`Onboarding error (${errorType}):`, error);
  
  // Default error message
  let errorMessage = 'An unexpected error occurred. Please try again.';
  
  // Customize error message based on error type
  switch (errorType) {
    case ErrorType.VALIDATION:
      errorMessage = 'Please check the form for errors and try again.';
      break;
    case ErrorType.AUTHENTICATION:
      errorMessage = 'Authentication failed. Please check your email and password.';
      break;
    case ErrorType.DATABASE:
      errorMessage = 'Error saving your information. Please try again.';
      break;
    case ErrorType.PET_ID_GENERATION:
      errorMessage = 'Error generating Pet ID. Please try again.';
      break;
    case ErrorType.FILE_UPLOAD:
      errorMessage = 'Error uploading file. Please try a different file or try again later.';
      break;
    case ErrorType.NETWORK:
      errorMessage = 'Network error. Please check your connection and try again.';
      break;
  }
  
  // If the error has a specific message, use it
  if (error.message) {
    errorMessage = error.message;
  }
  
  // Display error to user
  toast.error(errorMessage);
  
  // Return the error for further handling if needed
  return {
    type: errorType,
    message: errorMessage,
    originalError: error,
  };
}

// Retry function for operations that might fail temporarily
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Wait before retrying
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        // Exponential backoff
        delay *= 2;
      }
    }
  }
  
  throw lastError;
}
```

## Integration with Frontend

Now we'll update the `handleSubmit` function in the `OnboardingFlow` component to use our new backend functions:

```typescript
// src/components/onboarding/OnboardingFlow.tsx
// ... existing imports ...
import { validateOnboardingData } from '@/utils/validation';
import { handleOnboardingError, ErrorType, withRetry } from '@/utils/error-handling';
import { createPetWithOnboardingData } from '@/contexts/pets/api';
import { signUp } from '@/contexts/auth/operations';

// ... existing code ...

const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    // Validate all data
    const validationResult = validateOnboardingData({
      petInfo: state.petInfo,
      ownerInfo: state.ownerInfo,
      petLifestyle: state.petLifestyle,
      accountInfo: state.accountInfo,
    });
    
    if (!validationResult.success) {
      throw new Error('Validation failed: ' + validationResult.error.message);
    }
    
    // Show generating Pet ID message
    toast.info("Creating your account and generating unique Pet ID...");
    
    // 1. Create user account
    const { success, user, error } = await signUp(
      state.accountInfo.email,
      state.accountInfo.password,
      {
        full_name: state.ownerInfo.fullName,
      }
    );
    
    if (!success || !user) {
      throw new Error(error?.message || 'Failed to create account');
    }
    
    // 2. Create pet and related data
    const pet = await withRetry(() => createPetWithOnboardingData(
      user.id,
      state.petInfo,
      state.ownerInfo,
      state.petLifestyle
    ));
    
    // Success! Redirect to dashboard
    toast.success(`Welcome to MyPetID! Your Pet ID is ${pet.petIdentifier}`);
    navigate('/dashboard');
    
  } catch (error: any) {
    // Determine error type
    let errorType = ErrorType.UNKNOWN;
    
    if (error.message?.includes('validation')) {
      errorType = ErrorType.VALIDATION;
    } else if (error.message?.includes('auth') || error.message?.includes('password')) {
      errorType = ErrorType.AUTHENTICATION;
    } else if (error.message?.includes('Pet ID')) {
      errorType = ErrorType.PET_ID_GENERATION;
    } else if (error.message?.includes('upload')) {
      errorType = ErrorType.FILE_UPLOAD;
    } else if (error.message?.includes('network')) {
      errorType = ErrorType.NETWORK;
    } else if (error.code?.startsWith('23')) { // PostgreSQL error codes
      errorType = ErrorType.DATABASE;
    }
    
    handleOnboardingError(error, errorType);
  } finally {
    setIsSubmitting(false);
  }
};

// ... existing code ...
```

This implementation ensures that:

1. All data is validated before submission
2. User account creation is handled first
3. Pet and related data are created with proper relationships
4. A unique Pet ID is generated and stored
5. Errors are handled appropriately with user-friendly messages
6. The user is redirected to the dashboard upon successful completion

In the next document (plan5.md), we'll cover testing, deployment, and future enhancements for the onboarding flow.
