
import { useState } from 'react';
import { Reminder } from '../../types';
import { toast } from 'sonner';
import { rescheduleReminderInSupabase, saveRemindersToLocalStorage } from '../../api';

interface UseRescheduleReminderProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  userId: string | undefined;
}

export const useRescheduleReminder = ({
  reminders,
  setReminders,
  setError,
  userId
}: UseRescheduleReminderProps) => {
  const [selectedReminderId, setSelectedReminderId] = useState<string | null>(null);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  
  const selectedReminder = reminders.find(reminder => reminder.id === selectedReminderId);
  
  const handleOpenRescheduleDialog = (id: string) => {
    setSelectedReminderId(id);
    setIsRescheduleDialogOpen(true);
  };
  
  const handleRescheduleReminder = async (data: { newDate: Date, reminderId?: string }) => {
    // Extract values from the data object
    const { newDate, reminderId } = data;
    
    // Use the provided reminderId or fallback to the selectedReminderId from state
    console.log('DEBUG - Reschedule Reminder - User ID:', userId);
    console.log('DEBUG - Reschedule Reminder - Provided Reminder ID:', reminderId);
    console.log('DEBUG - Reschedule Reminder - Selected Reminder ID (state):', selectedReminderId);
    
    // Use the provided reminderId if available, otherwise use selectedReminderId
    const reminderIdToUse = reminderId || selectedReminderId;
    
    if (!userId) {
      console.error('DEBUG - Reschedule Reminder Auth Error - No user ID');
      toast.error('You must be logged in to reschedule a reminder');
      return;
    }
    
    if (!reminderIdToUse) {
      console.error('DEBUG - Reschedule Reminder Error - No reminder ID provided');
      toast.error('No reminder selected for rescheduling');
      return;
    }

    try {
      setError(null);
      // Update in database using the reminder ID from form data or state
      await rescheduleReminderInSupabase(reminderIdToUse, newDate);
      
      // Update in local state
      const updatedReminders = reminders.map(reminder => 
        reminder.id === reminderIdToUse ? { ...reminder, date: newDate } : reminder
      );
      setReminders(updatedReminders);
      
      // Save to localStorage as backup
      saveRemindersToLocalStorage(updatedReminders);
      
      setIsRescheduleDialogOpen(false);
      setSelectedReminderId(null);
      
      toast.success('Reminder rescheduled successfully!');
    } catch (error) {
      console.error('Error rescheduling reminder in Supabase:', error);
      setError('Failed to reschedule reminder. Please try again.');
      toast.error('Failed to reschedule reminder. Please try again.');
      
      // Fallback to localStorage only
      try {
        const updatedReminders = reminders.map(reminder => 
          reminder.id === reminderIdToUse ? { ...reminder, date: newDate } : reminder
        );
        setReminders(updatedReminders);
        saveRemindersToLocalStorage(updatedReminders);
        
        setIsRescheduleDialogOpen(false);
        setSelectedReminderId(null);
        
        toast.success('Reminder rescheduled in local storage only!');
      } catch (localError) {
        console.error('Error rescheduling reminder in localStorage:', localError);
      }
    }
  };
  
  return {
    selectedReminderId,
    selectedReminder,
    isRescheduleDialogOpen,
    setSelectedReminderId,
    setIsRescheduleDialogOpen,
    handleOpenRescheduleDialog,
    handleRescheduleReminder
  };
};
