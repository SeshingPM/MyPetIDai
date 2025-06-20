
import { useRemindersData } from './hooks/useRemindersData';
import { useReminderActions } from './hooks/useReminderActions';
import { useMemoizedReminders } from './utils/useMemoizedReminders';
import { useAuth } from '@/contexts/AuthContext';
import { Pet } from './types';

export const useReminderState = (petsFromContext: Pet[] = []) => {
  const { user } = useAuth();
  
  // Get reminders data (loading, fetching, error handling)
  const { reminders, setReminders, loading, error, setError } = useRemindersData(user?.id);
  
  // Use memoized filtering to prevent unnecessary recomputation
  const {
    activeReminders,
    archivedReminders,
    todayReminders,
    upcomingReminders,
    overdueReminders
  } = useMemoizedReminders(reminders);
  
  // Get reminder action handlers - pass in pets from context
  const reminderActions = useReminderActions({
    reminders,
    setReminders,
    setError,
    pets: petsFromContext, // Use pets from context
    userId: user?.id
  });
  
  return {
    reminders,
    pets: petsFromContext, // Return pets from context
    loading,
    error,
    activeReminders,
    archivedReminders,
    todayReminders,
    upcomingReminders,
    overdueReminders,
    ...reminderActions
  };
};
