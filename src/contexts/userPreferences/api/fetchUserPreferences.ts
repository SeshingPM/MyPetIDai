
import { supabase } from '@/integrations/supabase/client';
import { UserPreferences } from '../types';
import { toast } from 'sonner';
import { mapDatabaseToUserPreferences } from './mappers';
import { createDefaultPreferences } from './createDefaultPreferences';
import { handleApiError } from './errorHandler';

// Fetch user preferences
export const fetchUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  try {
    if (!userId) {
      console.warn('Cannot fetch user preferences: No user ID provided');
      return null;
    }

    console.log('Fetching preferences for user:', userId);
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // Check if the error is due to table not existing (common during development)
      if (error.code === '42P01') {
        console.error('User preferences table does not exist:', error);
        toast.error('User preferences system is not fully set up. Please contact support.');
        return null;
      }
      
      // Check if it's a "not found" error, which is expected for new users
      if (error.code === 'PGRST116') {
        console.log('No preferences found for user, creating defaults');
        return await createDefaultPreferences(userId);
      }
      
      throw error;
    }
    
    if (data) {
      return mapDatabaseToUserPreferences(data);
    }
    
    // If no preferences exist yet, create default preferences
    return await createDefaultPreferences(userId);
  } catch (error) {
    return handleApiError(error, 'Failed to load your notification preferences');
  }
};
