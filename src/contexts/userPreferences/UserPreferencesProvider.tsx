
import React from 'react';
import { UserPreferencesContext } from './UserPreferencesContext';
import { useUserPreferencesState } from './hooks/useUserPreferencesState';
import { useUserPreferencesActions } from './hooks/useUserPreferencesActions';
import { useAuth } from '@/contexts/AuthContext';

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const {
    preferences,
    setPreferences,
    loading,
    setLoading,
    error,
    setError,
    initialLoadAttempted
  } = useUserPreferencesState(user?.id);

  const {
    updateEmailNotifications,
    updateReminderAdvanceNotice,
    updateReminderTime,
    retryLoading
  } = useUserPreferencesActions({
    userId: user?.id,
    preferences,
    setPreferences,
    setError,
    setLoading
  });

  return (
    <UserPreferencesContext.Provider 
      value={{
        preferences,
        loading,
        error,
        updateEmailNotifications,
        updateReminderAdvanceNotice,
        updateReminderTime,
        retryLoading
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
