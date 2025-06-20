
import React, { createContext, useContext } from 'react';
import { UserPreferencesContextType } from './types';

// Create the context with undefined as initial value
const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

// Custom hook to use the user preferences context
export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

export { UserPreferencesContext };
