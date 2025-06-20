
import { useState, useEffect } from 'react';
import { Reminder } from '../types';
import { mockReminders } from '../mock-data';
import { 
  fetchRemindersFromSupabase, 
  getRemindersFromLocalStorage, 
  saveRemindersToLocalStorage 
} from '../api';
import { toast } from 'sonner';

export const useRemindersData = (userId: string | undefined) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load reminders from Supabase
  useEffect(() => {
    const fetchReminders = async () => {
      if (!userId) {
        setReminders([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const reminderData = await fetchRemindersFromSupabase(userId);
        
        if (reminderData) {
          setReminders(reminderData);
          
          // Backup to localStorage
          saveRemindersToLocalStorage(reminderData);
        } else {
          // Fallback to localStorage if no data in Supabase
          const storedReminders = getRemindersFromLocalStorage();
          
          if (storedReminders) {
            setReminders(storedReminders);
          } else {
            // Use mock data for initial state
            setReminders(mockReminders);
            // Save mock data to localStorage
            saveRemindersToLocalStorage(mockReminders);
          }
        }
      } catch (error) {
        console.error('Error loading reminders from Supabase:', error);
        setError('Failed to load reminders. Please refresh the page.');
        toast.error('Failed to load reminders. Please refresh the page.');
        
        // Fallback to localStorage
        try {
          const storedReminders = getRemindersFromLocalStorage();
          
          if (storedReminders) {
            setReminders(storedReminders);
          } else {
            setReminders(mockReminders);
          }
        } catch (localError) {
          console.error('Error loading reminders from localStorage:', localError);
          setReminders(mockReminders);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, [userId]);

  // Save reminders to localStorage as backup when they change
  useEffect(() => {
    saveRemindersToLocalStorage(reminders);
  }, [reminders]);
  
  return { reminders, setReminders, loading, error, setError };
};
