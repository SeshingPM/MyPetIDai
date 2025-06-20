import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { AccountCreationStepProps, AccountInfo } from '@/types/onboarding';

// Validation schema
const accountCreationSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and conditions' })
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type AccountCreationFormValues = z.infer<typeof accountCreationSchema>;

/**
 * Account Creation Step
 * Final step in the onboarding flow for creating user account
 */
const AccountCreationStep: React.FC<AccountCreationStepProps> = ({ 
  data, 
  onUpdate, 
  onNext, 
  onPrevious,
  isSubmitting 
}) => {
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Initialize form with react-hook-form and zod validation
  const { 
    register, 
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, dirtyFields, touchedFields } 
  } = useForm<AccountCreationFormValues>({
    resolver: zodResolver(accountCreationSchema),
    defaultValues: {
      email: data.email || '',
      password: data.password || '',
      confirmPassword: data.confirmPassword || '',
      // Cast to `any` first to avoid TS error since we're handling validation through the form
      agreeToTerms: data.agreeToTerms as any || false,
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
  });

  /**
   * Form submission handler - Only triggered if validation passes
   */
  const onSubmit = async (formData: AccountCreationFormValues) => {
    // Debug the form data before submission
    console.log('Form validation PASSED - onSubmit triggered');
    console.log('Form submission - email value:', formData.email);
    console.log('Form submission - full data:', formData);
    console.log('Form valid?', isValid);
    
    try {
      // Convert form data to AccountInfo type
      const accountInfo: AccountInfo = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: formData.agreeToTerms
      };
      
      // Update parent state with properly typed data
      console.log('Updating parent state with account info');
      onUpdate(accountInfo);
      
      console.log('After state update - continuing to next step');
      
      // Complete onboarding immediately - pass accountInfo directly to avoid race condition
      onNext(accountInfo);
    } catch (error) {
      console.error('Error in onSubmit handler:', error);
      toast.error('Something went wrong while processing your account');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Debug validation state
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log('Form values changed:', value);
      console.log('Form validity:', isValid);
      console.log('Field errors:', errors);
    });
    return () => subscription.unsubscribe();
  }, [watch, isValid, errors]);
  
  // Debug validation errors
  const debugFormSubmit = (errors: any) => {
    console.log('Debug form validation errors', errors);
    console.log('Form is valid:', isValid);
    console.log('Current errors:', errors);
    console.log('Dirty fields:', dirtyFields);
    console.log('Touched fields:', touchedFields);
    
    // Show validation issues in UI
    toast.error('Form validation failed', {
      description: (
        <ul className="list-disc pl-4 text-sm">
          {errors.email && <li>Email: {errors.email.message}</li>}
          {errors.password && <li>Password: {errors.password.message}</li>}
          {errors.confirmPassword && <li>Confirm password: {errors.confirmPassword.message}</li>}
          {errors.agreeToTerms && <li>Terms: {errors.agreeToTerms.message}</li>}
          {!Object.keys(errors).length && <li>Unknown validation issue</li>}
        </ul>
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create Your Account</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Set up your account to save your pet's information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, debugFormSubmit)} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            {...register('email')}
            className={cn(
              errors.email && 'border-red-500 focus-visible:ring-red-500'
            )}
            aria-invalid={errors.email ? 'true' : 'false'}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              {...register('password')}
              className={cn(
                errors.password && 'border-red-500 focus-visible:ring-red-500'
              )}
              aria-invalid={errors.password ? 'true' : 'false'}
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
          <ul className="text-xs text-gray-500 list-disc pl-5 pt-1">
            <li>At least 8 characters</li>
            <li>At least one lowercase letter</li>
            <li>At least one uppercase letter</li>
            <li>At least one number</li>
          </ul>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register('confirmPassword')}
              className={cn(
                errors.confirmPassword && 'border-red-500 focus-visible:ring-red-500'
              )}
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showConfirmPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={watch('agreeToTerms') as boolean}
            onCheckedChange={(checked) => {
              // Using setValue to ensure proper update
              // Cast to appropriate type as required by the schema
              if (checked === true) {
                setValue('agreeToTerms', true as const, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
              } else {
                // When unchecked, reset to false
                setValue('agreeToTerms', false as any, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
              }
            }}
            disabled={isSubmitting}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="agreeToTerms"
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                errors.agreeToTerms && "text-red-500"
              )}
            >
              I agree to the Terms of Service and Privacy Policy
            </Label>
            {errors.agreeToTerms && (
              <p className="text-xs text-red-500">{errors.agreeToTerms.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            className="sm:flex-1"
            onClick={onPrevious}
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="sm:flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountCreationStep;
