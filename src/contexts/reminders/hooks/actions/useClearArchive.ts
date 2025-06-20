
import { Reminder } from '../../types';
import { toast } from 'sonner';
import { clearArchiveInSupabase, saveRemindersToLocalStorage } from '../../api';

interface UseClearArchiveProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  userId: string | undefined;
}

export const useClearArchive = ({
  reminders,
  setReminders,
  setError,
  userId
}: UseClearArchiveProps) => {
  
  const handleClearArchive = async () => {
    if (!userId) {
      toast.error('You must be logged in to clear archive');
      return;
    }

    try {
      setError(null);
      // Delete archived reminders from database
      await clearArchiveInSupabase(userId);
      
      // Update local state
      const filteredReminders = reminders.filter(reminder => !reminder.archived);
      setReminders(filteredReminders);
      
      // Save to localStorage as backup
      saveRemindersToLocalStorage(filteredReminders);
      
      toast.success('Archive cleared successfully!');
    } catch (error) {
      console.error('Error clearing archive in Supabase:', error);
      setError('Failed to clear archive. Please try again.');
      toast.error('Failed to clear archive. Please try again.');
      
      // Fallback to localStorage only
      try {
        const filteredReminders = reminders.filter(reminder => !reminder.archived);
        setReminders(filteredReminders);
        saveRemindersToLocalStorage(filteredReminders);
        
        toast.success('Archive cleared in local storage only!');
      } catch (localError) {
        console.error('Error clearing archive in localStorage:', localError);
      }
    }
  };
  
  return {
    handleClearArchive
  };
};
