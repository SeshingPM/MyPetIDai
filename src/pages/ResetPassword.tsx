import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, CheckCircle, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEO from '@/components/seo/SEO';
import logger from '@/utils/logger';
// Import useAuth to get authentication state
import { useAuth } from '@/contexts/AuthContext';

// Define form schema with password requirements
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  // Get auth state from context
  const { user, session, isLoading: isAuthLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed from isLoading to avoid clash
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Set flags to prevent redirect on initial mount and clean up on unmount
  // This still seems necessary to prevent useAuthState from navigating away prematurely
  useEffect(() => {
    const isResetPasswordFlow = window.location.pathname === '/reset-password' ||
                                window.location.hash.includes('type=recovery');

    if (isResetPasswordFlow) {
      sessionStorage.setItem('is_reset_password_flow', 'true');
      localStorage.setItem('password_reset_in_progress', 'true');
      logger.info('Set reset password flow flags');
    }

    // Clean up flags when component unmounts or user navigates away
    return () => {
      sessionStorage.removeItem('is_reset_password_flow');
      // Keep local storage flag until password is changed or flow is abandoned
      // localStorage.removeItem('password_reset_in_progress'); 
      logger.info('Removed session reset password flow flag');
    };
  }, []);


  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true); // Use isSubmitting here
    setError(null);

    try {
      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) {
        logger.error('Error updating password:', updateError.message);
        setError(updateError.message);
        setIsSubmitting(false); // Use isSubmitting here
        return;
      }

      // Clear the password reset flags after successful password reset
      sessionStorage.removeItem('is_reset_password_flow');
      localStorage.removeItem('password_reset_in_progress');
      logger.info('Password reset successful, cleared reset flow flags');

      // Success
      setSuccess(true);
      // Redirect to login after successful password reset
      setTimeout(() => {
        navigate('/login?passwordResetSuccess=true'); // Add query param for potential success message on login
      }, 3000);
    } catch (err: any) {
      logger.error('Unexpected error in onSubmit:', err);
      setError(err.message || 'An unexpected error occurred');
       // Only set submitting to false if there was an error
       setIsSubmitting(false); 
    } 
    // Removed finally block to avoid setting isSubmitting false on success navigate
  };

  // Render Loading state while auth context is initializing
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {/* Consider replacing with a dedicated LoadingSpinner component */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render error state if auth context finished loading but there's no user/session
  // This means the PASSWORD_RECOVERY event didn't happen or failed
  if (!user || !session) {
     return (
      <>
        <SEO title="Invalid Link" description="Password reset link is invalid or expired." />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-destructive flex items-center justify-center gap-2">
                   <AlertTriangle className="h-6 w-6" />
                   Invalid Link
                 </CardTitle>
              </CardHeader>
              <CardContent>
                 <Alert variant="destructive" className="mb-6">
                    <AlertDescription>
                      The password reset link is invalid or has expired. Please request a new one.
                    </AlertDescription>
                 </Alert>
                 <Button onClick={() => navigate('/forgot-password')} className="w-full">
                   Request New Link
                 </Button>
              </CardContent>
            </Card>
          </main>
        </div>
       </>
    );
  }


  // Render the form if user/session exist (meaning PASSWORD_RECOVERY was successful)
  return (
    <>
      <SEO title="Reset Password" description="Reset your MyPetID password." />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <KeyRound className="h-6 w-6" />
                Reset Your Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              {success ? (
                <Alert className="bg-green-100 border-green-300 text-green-800">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertDescription>
                    Your password has been successfully reset. Redirecting you
                    to login...
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-5 w-5" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register('password')}
                      placeholder="Enter your new password"
                      className={errors.password ? 'border-destructive' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword')}
                      placeholder="Confirm your new password"
                       className={errors.confirmPassword ? 'border-destructive' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default ResetPassword;
