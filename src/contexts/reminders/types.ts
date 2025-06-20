export interface Reminder {
  id: string;
  title: string;
  date: Date;
  petId?: string; // Kept for backward compatibility
  petName?: string; // Kept for backward compatibility
  pets?: ReminderPet[]; // New field for multiple pets
  notes?: string;
  archived?: boolean;
  customTime?: string;
  notificationSent?: boolean;
}

export interface ReminderPet {
  petId: string;
  petName: string;
}

export interface Pet {
  id: string;
  name: string;
  breed?: string;
  age?: number;
  photoUrl?: string;
}

export interface ReminderContextType {
  reminders: Reminder[];
  pets: Pet[];
  activeReminders: Reminder[];
  archivedReminders: Reminder[];
  todayReminders: Reminder[];
  upcomingReminders: Reminder[];
  overdueReminders: Reminder[];
  selectedReminderId: string | null;
  selectedReminder: Reminder | undefined;
  isAddReminderDialogOpen: boolean;
  isRescheduleDialogOpen: boolean;
  isEditDialogOpen: boolean;
  loading: boolean;
  error: string | null;
  setIsAddReminderDialogOpen: (isOpen: boolean) => void;
  setIsRescheduleDialogOpen: (isOpen: boolean) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setSelectedReminderId: (id: string | null) => void;
  handleAddReminder: (
    data: Omit<Reminder, "id" | "petName"> & {
      useCustomTime?: boolean;
      customTime?: string;
      petId?: string; // Now matches the interface above
    }
  ) => void;
  handleCompleteReminder: (id: string) => void;
  handleRescheduleReminder: (data: {
    newDate: Date;
    reminderId?: string;
  }) => void;
  handleOpenRescheduleDialog: (id: string) => void;
  handleOpenEditDialog: (id: string) => void;
  handleEditReminder: (data: {
    title: string;
    date: Date;
    petId?: string;
    notes?: string;
    useCustomTime?: boolean;
    customTime?: string;
  }) => void;
  handleClearArchive: () => void;
}
