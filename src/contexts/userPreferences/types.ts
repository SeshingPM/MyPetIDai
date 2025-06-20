
export interface UserPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
  reminderAdvanceNotice: number; // hours
  reminderTime: string; // in HH:MM format
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferencesContextType {
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  updateEmailNotifications: (enabled: boolean) => Promise<void>;
  updateReminderAdvanceNotice: (hours: number) => Promise<void>;
  updateReminderTime: (time: string) => Promise<void>;
  retryLoading: () => Promise<void>;
}
