
import { supabase } from '@/integrations/supabase/client';
import { UserPreferences } from '../types';
import { toast } from 'sonner';
import { mapDatabaseToUserPreferences } from './mappers';
import { handleApiError } from './errorHandler';

// Create default preferences if none exist
export const createDefaultPreferences = async (userId: string): Promise<UserPreferences | null> => {
  try {
    console.log('Creating default preferences for user:', userId);
    const { data, error } = await supabase
      .from('user_preferences')
      .insert({
        user_id: userId,
        email_notifications: true,
        reminder_advance_notice: 24,
        reminder_time: '09:00:00'
      })
      .select()
      .single();
    
    if (error) {
      if (error.code === '42P01') {
        console.warn('Table does not exist, returning mock preferences');
        // Return mock preferences during development
        return {
          id: 'mock-id',
          userId: userId,
          emailNotifications: true,
          reminderAdvanceNotice: 24,
          reminderTime: '09:00:00',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }

      if (error.code === '23505') {
        // Handle duplicate key value error
        console.log('Preferences already exist, fetching existing');
        const { data: existingData, error: fetchError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (fetchError) {
          throw fetchError;
        }
        
        if (existingData) {
          return mapDatabaseToUserPreferences(existingData);
        }
      }
      
      throw error;
    }
    
    if (data) {
      return mapDatabaseToUserPreferences(data);
    }
    
    return null;
  } catch (error) {
    return handleApiError(error, 'Failed to create default notification settings');
  }
};
