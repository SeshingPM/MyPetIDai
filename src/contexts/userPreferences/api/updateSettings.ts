
import { supabase } from '@/integrations/supabase/client';
import { UserPreferences } from '../types';
import { toast } from 'sonner';
import { mapDatabaseToUserPreferences } from './mappers';
import { handleApiError } from './errorHandler';

// Update email notifications setting
export const updateEmailNotificationSetting = async (
  userId: string, 
  enabled: boolean
): Promise<UserPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .update({ 
        email_notifications: enabled,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    if (data) {
      toast.success(`Email notifications ${enabled ? 'enabled' : 'disabled'}`);
      return mapDatabaseToUserPreferences(data);
    }
    
    return null;
  } catch (error) {
    return handleApiError(error, 'Failed to update email notification settings');
  }
};

// Update reminder advance notice
export const updateReminderAdvanceNoticeSetting = async (
  userId: string, 
  hours: number
): Promise<UserPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .update({ 
        reminder_advance_notice: hours,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    if (data) {
      toast.success(`Reminder advance notice updated to ${hours} hours`);
      return mapDatabaseToUserPreferences(data);
    }
    
    return null;
  } catch (error) {
    return handleApiError(error, 'Failed to update reminder timing settings');
  }
};

// Update reminder time
export const updateReminderTimeSetting = async (
  userId: string, 
  time: string
): Promise<UserPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .update({ 
        reminder_time: time,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    if (data) {
      toast.success(`Default reminder time updated to ${time}`);
      return mapDatabaseToUserPreferences(data);
    }
    
    return null;
  } catch (error) {
    return handleApiError(error, 'Failed to update reminder time setting');
  }
};
