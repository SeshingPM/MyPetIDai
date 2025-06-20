
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ReminderContextType } from './types';
import { useReminderState } from './useReminderState';
import { toast } from 'sonner';
import { UserPreferencesProvider } from '@/contexts/userPreferences';
import { usePets } from '@/contexts/PetsContext';

export const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pets } = usePets();
  const reminderState = useReminderState(pets);
  const [selectedReminderId, setSelectedReminderId] = useState<string | null>(null);
  const [isAddReminderDialogOpen, setIsAddReminderDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Add error handling for API operations
  useEffect(() => {
    if (reminderState.error) {
      toast.error(`Reminder operation failed: ${reminderState.error}`);
    }
  }, [reminderState.error]);

  // Calculate selected reminder
  const selectedReminder = reminderState.reminders.find(
    reminder => reminder.id === selectedReminderId
  );

  const handleOpenRescheduleDialog = (id: string) => {
    setSelectedReminderId(id);
    setIsRescheduleDialogOpen(true);
  };
  
  const handleOpenEditDialog = (id: string) => {
    setSelectedReminderId(id);
    setIsEditDialogOpen(true);
  };

  return (
    <UserPreferencesProvider>
      <ReminderContext.Provider 
        value={{
          ...reminderState,
          activeReminders: reminderState.activeReminders,
          archivedReminders: reminderState.archivedReminders,
          todayReminders: reminderState.todayReminders,
          upcomingReminders: reminderState.upcomingReminders,
          overdueReminders: reminderState.overdueReminders,
          selectedReminderId,
          selectedReminder,
          isAddReminderDialogOpen,
          isRescheduleDialogOpen,
          isEditDialogOpen,
          setSelectedReminderId,
          setIsAddReminderDialogOpen,
          setIsRescheduleDialogOpen,
          setIsEditDialogOpen,
          handleOpenRescheduleDialog,
          handleOpenEditDialog,
          handleEditReminder: reminderState.handleEditReminder,
          handleRescheduleReminder: reminderState.handleRescheduleReminder
        }}
      >
        {children}
      </ReminderContext.Provider>
    </UserPreferencesProvider>
  );
};

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
};
