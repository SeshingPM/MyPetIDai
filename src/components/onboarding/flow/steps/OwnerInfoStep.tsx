import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { OwnerInfoStepProps, OwnerInfo } from '@/types/onboarding';

// Phone number formatting utilities
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Apply formatting based on length
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};

const getDigitsOnly = (value: string): string => {
  return value.replace(/\D/g, '');
};

// Validation schema
const ownerInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  zipCode: z.string().min(5, 'Valid zip code is required').max(10),
  phone: z.string().min(10, 'Phone number is required').max(10, 'Phone number must be 10 digits'),
});

type OwnerInfoFormValues = z.infer<typeof ownerInfoSchema>;

/**
 * Owner Information Step
 * Second step in the onboarding flow for collecting owner information
 */
const OwnerInfoStep: React.FC<OwnerInfoStepProps> = ({ 
  data, 
  onUpdate, 
  onNext, 
  onPrevious 
}) => {
  // Initialize form with react-hook-form and zod validation
  const { 
    register, 
    control,
    handleSubmit, 
    watch,
    formState: { errors, isValid } 
  } = useForm<OwnerInfoFormValues>({
    resolver: zodResolver(ownerInfoSchema),
    defaultValues: {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      zipCode: data.zipCode || '',
      phone: data.phone || '',
    },
    mode: 'onChange',
  });

  // Watch the phone field to conditionally show SMS opt-in
  const phoneValue = watch('phone');

  // Handle form submission
  const onSubmit = (formData: OwnerInfoFormValues) => {
    // Update parent component state
    const updatedData: OwnerInfo = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      zipCode: formData.zipCode,
      phone: formData.phone || '',
      smsOptIn: false, // Default to false since we removed the checkbox
    };
    
    onUpdate(updatedData);
    
    // Navigate to next step
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Information</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Help us get to know you better
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Enter your first name"
            {...register('firstName')}
            className={cn(
              errors.firstName && 'border-red-500 focus-visible:ring-red-500'
            )}
            aria-invalid={errors.firstName ? 'true' : 'false'}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Enter your last name"
            {...register('lastName')}
            className={cn(
              errors.lastName && 'border-red-500 focus-visible:ring-red-500'
            )}
            aria-invalid={errors.lastName ? 'true' : 'false'}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>

        {/* Zip Code */}
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            placeholder="Enter your zip code"
            {...register('zipCode')}
            className={cn(
              errors.zipCode && 'border-red-500 focus-visible:ring-red-500'
            )}
            aria-invalid={errors.zipCode ? 'true' : 'false'}
          />
          {errors.zipCode && (
            <p className="text-sm text-red-500">{errors.zipCode.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                id="phone"
                type="tel"
                placeholder="(123) 456-7890"
                value={formatPhoneNumber(value)}
                onChange={(e) => onChange(getDigitsOnly(e.target.value))}
                onBlur={onBlur}
                className={cn(
                  errors.phone && 'border-red-500 focus-visible:ring-red-500'
                )}
                aria-invalid={errors.phone ? 'true' : 'false'}
              />
            )}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
          <p className="text-xs text-gray-500">
            We'll use this number to send you SMS updates about your pet's profile.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="sm:flex-1"
            onClick={onPrevious}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="sm:flex-1"
            disabled={!isValid}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OwnerInfoStep;
