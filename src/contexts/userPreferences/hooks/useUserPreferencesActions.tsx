
import { 
  updateEmailNotificationSetting, 
  updateReminderAdvanceNoticeSetting, 
  updateReminderTimeSetting,
  fetchUserPreferences
} from '../api';
import { UserPreferences } from '../types';
import { toast } from 'sonner';

export interface UserPreferencesActionsProps {
  userId: string | undefined;
  preferences: UserPreferences | null;
  setPreferences: (preferences: UserPreferences | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useUserPreferencesActions = ({
  userId,
  preferences,
  setPreferences,
  setError,
  setLoading
}: UserPreferencesActionsProps) => {
  
  const updateEmailNotifications = async (enabled: boolean) => {
    if (!userId || !preferences) return;
    
    try {
      const updatedPreferences = await updateEmailNotificationSetting(userId, enabled);
      if (updatedPreferences) {
        setPreferences(updatedPreferences);
      }
    } catch (err) {
      console.error('Failed to update email notifications:', err);
      setError('Failed to update email notification settings');
    }
  };

  const updateReminderAdvanceNotice = async (hours: number) => {
    if (!userId || !preferences) return;
    
    try {
      const updatedPreferences = await updateReminderAdvanceNoticeSetting(userId, hours);
      if (updatedPreferences) {
        setPreferences(updatedPreferences);
      }
    } catch (err) {
      console.error('Failed to update reminder advance notice:', err);
      setError('Failed to update reminder timing settings');
    }
  };

  const updateReminderTime = async (time: string) => {
    if (!userId || !preferences) return;
    
    try {
      const updatedPreferences = await updateReminderTimeSetting(userId, time);
      if (updatedPreferences) {
        setPreferences(updatedPreferences);
      }
    } catch (err) {
      console.error('Failed to update reminder time:', err);
      setError('Failed to update reminder time setting');
    }
  };

  // Reset error and attempt reload
  const retryLoading = async () => {
    if (!userId) return;
    setError(null);
    setLoading(true);
    try {
      const data = await fetchUserPreferences(userId);
      setPreferences(data);
      if (data) {
        toast.success('Preferences loaded successfully');
      }
    } catch (err: any) {
      console.error('Retry failed to load user preferences:', err);
      setError(err?.message || 'Failed to load your notification preferences');
    } finally {
      setLoading(false);
    }
  };

  return {
    updateEmailNotifications,
    updateReminderAdvanceNotice,
    updateReminderTime,
    retryLoading
  };
};
