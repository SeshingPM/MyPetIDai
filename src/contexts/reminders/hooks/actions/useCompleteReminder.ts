
import { Reminder } from '../../types';
import { toast } from 'sonner';
import { completeReminderInSupabase, saveRemindersToLocalStorage } from '../../api';

interface UseCompleteReminderProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  userId: string | undefined;
}

export const useCompleteReminder = ({
  reminders,
  setReminders,
  setError,
  userId
}: UseCompleteReminderProps) => {
  
  const handleCompleteReminder = async (id: string) => {
    if (!userId) {
      toast.error('You must be logged in to complete a reminder');
      return;
    }

    try {
      setError(null);
      // Update in database
      await completeReminderInSupabase(id);
      
      // Update in local state
      const updatedReminders = reminders.map(reminder => 
        reminder.id === id ? { ...reminder, archived: true } : reminder
      );
      setReminders(updatedReminders);
      
      // Save to localStorage as backup
      saveRemindersToLocalStorage(updatedReminders);
      
      toast.success('Reminder marked as complete!');
    } catch (error) {
      console.error('Error completing reminder in Supabase:', error);
      setError('Failed to update reminder. Please try again.');
      toast.error('Failed to update reminder. Please try again.');
      
      // Fallback to localStorage only
      try {
        const updatedReminders = reminders.map(reminder => 
          reminder.id === id ? { ...reminder, archived: true } : reminder
        );
        setReminders(updatedReminders);
        saveRemindersToLocalStorage(updatedReminders);
        
        toast.success('Reminder marked as complete in local storage only!');
      } catch (localError) {
        console.error('Error completing reminder in localStorage:', localError);
      }
    }
  };
  
  return {
    handleCompleteReminder
  };
};
