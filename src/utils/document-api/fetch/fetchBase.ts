
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async () => {
  const requestId = Math.random().toString(36).substring(2, 9);
  
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error(`[Auth ${requestId}] Error getting user:`, userError);
      return null;
    }
    
    if (!userData.user) {
      console.warn(`[Auth ${requestId}] No authenticated user found`);
      return null;
    }
    
    return userData.user;
  } catch (error) {
    console.error(`[Auth ${requestId}] Unexpected error:`, error);
    return null;
  }
};

/**
 * Build a base Supabase query for documents
 */
export const buildDocumentsQuery = (userId: string, options: { 
  petId?: string;
  archived?: boolean; 
} = {}) => {
  const { petId, archived } = options;
  
  // Start with the base query for the user's documents
  let query = supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId);
  
  // Add pet ID filter if provided
  if (petId) {
    query = query.eq('pet_id', petId);
  }
  
  // Add archived filter if specified
  if (archived !== undefined) {
    query = query.eq('archived', archived);
  }
  
  return query;
};

/**
 * Handle fetch errors in a consistent way with JWT error handling
 */
export const handleFetchError = async (error: any, operation: string, requestId: string) => {
  console.error(`[${operation} ${requestId}] Error:`, error);
  
  // Check for JWT or auth errors
  const errorMessage = error?.message || '';
  const isJwtError = errorMessage.toLowerCase().includes('jwt') || 
                     errorMessage.toLowerCase().includes('token') ||
                     errorMessage.includes('401');
  
  if (isJwtError) {
    console.warn(`[${operation} ${requestId}] JWT error detected, attempting session refresh`);
    
    try {
      // Try to refresh the session
      const { error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error(`[${operation} ${requestId}] Failed to refresh session:`, refreshError);
        toast.error('Your session has expired. Please sign in again.');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = `/login?return_to=${encodeURIComponent(window.location.pathname)}`;
        }, 2000);
      } else {
        // Session refreshed successfully
        toast.info('Session refreshed. Please try again.');
      }
    } catch (refreshError) {
      console.error(`[${operation} ${requestId}] Error during session refresh:`, refreshError);
    }
  }
  
  // Handle offline state
  if (!navigator.onLine) {
    toast.error('Network error. Please check your internet connection.');
  }
  
  return [];
};
