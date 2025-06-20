
import { Reminder, Pet } from '../types';
import { useAddReminder } from './actions/useAddReminder';
import { useCompleteReminder } from './actions/useCompleteReminder';
import { useRescheduleReminder } from './actions/useRescheduleReminder';
import { useEditReminder } from './actions/useEditReminder';
import { useClearArchive } from './actions/useClearArchive';

interface UseReminderActionsProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  pets: Pet[];
  userId: string | undefined;
}

export const useReminderActions = ({
  reminders,
  setReminders,
  setError,
  pets,
  userId
}: UseReminderActionsProps) => {
  // Use modular hooks for different actions
  const addReminderHook = useAddReminder({
    reminders,
    setReminders,
    setError,
    pets,
    userId
  });
  
  const completeReminderHook = useCompleteReminder({
    reminders,
    setReminders,
    setError,
    userId
  });
  
  const rescheduleReminderHook = useRescheduleReminder({
    reminders,
    setReminders,
    setError,
    userId
  });
  
  const editReminderHook = useEditReminder({
    reminders,
    setReminders,
    setError,
    pets,
    userId
  });
  
  const clearArchiveHook = useClearArchive({
    reminders,
    setReminders,
    setError,
    userId
  });
  
  // Combine and return all actions
  return {
    // Add reminder actions
    isAddReminderDialogOpen: addReminderHook.isAddReminderDialogOpen,
    setIsAddReminderDialogOpen: addReminderHook.setIsAddReminderDialogOpen,
    handleAddReminder: addReminderHook.handleAddReminder,
    
    // Complete reminder actions
    handleCompleteReminder: completeReminderHook.handleCompleteReminder,
    
    // Reschedule reminder actions
    selectedReminderId: rescheduleReminderHook.selectedReminderId || editReminderHook.selectedReminderId,
    selectedReminder: rescheduleReminderHook.selectedReminder || editReminderHook.selectedReminder,
    isRescheduleDialogOpen: rescheduleReminderHook.isRescheduleDialogOpen,
    setSelectedReminderId: rescheduleReminderHook.setSelectedReminderId,
    setIsRescheduleDialogOpen: rescheduleReminderHook.setIsRescheduleDialogOpen,
    handleOpenRescheduleDialog: rescheduleReminderHook.handleOpenRescheduleDialog,
    handleRescheduleReminder: rescheduleReminderHook.handleRescheduleReminder,
    
    // Edit reminder actions
    isEditDialogOpen: editReminderHook.isEditDialogOpen,
    setIsEditDialogOpen: editReminderHook.setIsEditDialogOpen,
    handleOpenEditDialog: editReminderHook.handleOpenEditDialog,
    handleEditReminder: editReminderHook.handleEditReminder,
    
    // Clear archive actions
    handleClearArchive: clearArchiveHook.handleClearArchive
  };
};
