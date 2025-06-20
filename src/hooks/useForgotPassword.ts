import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import logger from '@/utils/logger';

export interface ForgotPasswordResult {
  success: boolean;
  error?: {
    message: string;
  };
}

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async (email: string): Promise<ForgotPasswordResult> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      logger.info('Attempting to send password reset email to:', email);
      
      // Call Supabase API with redirectTo parameter
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        logger.error('Reset password error:', error.message);
        
        // Check for rate limit error and provide a user-friendly message
        if (typeof error.message === 'string' && (
          error.message.includes('rate limit') || 
          error.message.includes('too many requests')
        )) {
          const friendlyMessage = 'Too many password reset requests. Please wait a few minutes before trying again.';
          setError(friendlyMessage);
          return {
            success: false,
            error: {
              message: friendlyMessage,
            },
          };
        }
        
        // For all other errors, show a generic message in production
        // but include the actual error in development for debugging
        const errorMessage = process.env.NODE_ENV === 'production' ?
          'Unable to send password reset email. Please try again later.' :
          error.message;
          
        setError(errorMessage);
        return {
          success: false,
          error: {
            message: errorMessage,
          },
        };
      }

      // Successfully sent reset password email
      logger.info('Password reset email sent successfully');
      setSuccess(true);
      return { success: true };
    } catch (err: any) {
      logger.error('Unexpected error in resetPassword:', err);
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: {
          message: errorMessage,
        },
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resetPassword,
    isLoading,
    error,
    success,
  };
}
