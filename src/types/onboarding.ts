/**
 * Type definitions for the MyPetID onboarding flow
 */
import { z } from 'zod';

/**
 * The main onboarding state interface that holds all form data
 */
export interface OnboardingState {
  currentStep: number;
  petInfo: PetInfo;
  ownerInfo: OwnerInfo;
  petLifestyle: PetLifestyle;
  accountInfo: AccountInfo;
}

/**
 * Validation schemas for onboarding form data
 */
export const PetInfoSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  type: z.enum(['dog', 'cat', '']),
  breed: z.string(),
  gender: z.enum(['male', 'female', '']),
  birth_or_adoption_date: z.string().min(1, 'Birth/Adoption date is required'),
  photo: z.any().optional().nullable(),
  photoUrl: z.string().optional()
});

export const OwnerInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  zipCode: z.string().min(5, 'Valid ZIP code is required'),
  phone: z.string().optional(),
  smsOptIn: z.boolean()
});

export const PetLifestyleSchema = z.object({
  food: z.array(z.string()),
  treats: z.array(z.string()),
  allergies: z.array(z.string()),
  medications: z.array(z.string()),
  supplements: z.array(z.string()),
  insurance: z.string(),
  documents: z.any().optional().nullable(),
  documentUrls: z.array(z.string()).optional()
});

export const AccountInfoSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must include an uppercase letter')
    .regex(/[a-z]/, 'Password must include a lowercase letter')
    .regex(/[0-9]/, 'Password must include a number'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms of service'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

/**
 * Pet information collected in step 1
 */
export interface PetInfo {
  name: string;
  type: 'dog' | 'cat' | '';
  breed: string;
  gender: 'male' | 'female' | '';
  birth_or_adoption_date: string | null;
  photo?: File | null;
  photoUrl?: string;
}

/**
 * Owner information collected in step 2
 */
export interface OwnerInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
  phone?: string; // Optional per requirements
  smsOptIn: boolean;
  fullName?: string; // Added for Edge Function compatibility
}

/**
 * Pet lifestyle information collected in step 3
 */
export interface PetLifestyle {
  food: string[];
  treats: string[];
  allergies: string[];
  medications: string[];
  supplements: string[];
  insurance: string;
  documents?: File[] | null; // Optional per requirements
  documentUrls?: string[];
}

/**
 * Account information collected in step 4
 */
export interface AccountInfo {
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

/**
 * Navigation direction for step transitions
 */
export type NavigationDirection = 'next' | 'previous' | 'goto';

/**
 * Step IDs for the onboarding flow
 */
export enum OnboardingStepId {
  PET_INFO = 1,
  OWNER_INFO = 2,
  PET_LIFESTYLE = 3,
  ACCOUNT_CREATION = 4
}

/**
 * Props for the ProgressBar component
 */
export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  allowNavigation?: boolean;
}

/**
 * Base props for all step components
 */
export interface StepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting?: boolean;
}

/**
 * Specific props for each step component
 */
export interface PetInfoStepProps extends StepProps {
  data: PetInfo;
  onUpdate: (data: PetInfo) => void;
}

export interface OwnerInfoStepProps extends StepProps {
  data: OwnerInfo;
  onUpdate: (data: OwnerInfo) => void;
}

export interface PetLifestyleStepProps extends StepProps {
  data: PetLifestyle;
  onUpdate: (data: PetLifestyle) => void;
  petType?: string; // Add pet type for conditional options
}

export interface AccountCreationStepProps extends Omit<StepProps, 'onNext'> {
  data: AccountInfo;
  onUpdate: (data: AccountInfo) => void;
  onNext: (data?: AccountInfo) => void;
}
