
import { useState, useEffect } from 'react';
import { UserPreferences } from '../types';
import { fetchUserPreferences } from '../api';
import { toast } from 'sonner';

export const useUserPreferencesState = (userId: string | undefined) => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);

  // Load preferences when user changes
  useEffect(() => {
    const loadPreferences = async () => {
      if (!userId) {
        setPreferences(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const timer = setTimeout(async () => {
          console.log('Loading preferences for user:', userId);
          const data = await fetchUserPreferences(userId);
          setPreferences(data);
          setLoading(false);
          setInitialLoadAttempted(true);
        }, 500);
        
        return () => clearTimeout(timer);
      } catch (err: any) {
        console.error('Failed to load user preferences:', err);
        setError(err?.message || 'Failed to load your notification preferences');
        setLoading(false);
        setInitialLoadAttempted(true);
      }
    };

    if (!initialLoadAttempted || (userId && !preferences)) {
      loadPreferences();
    }
  }, [userId, initialLoadAttempted, preferences]);

  // Use mock data in development if there's an error
  useEffect(() => {
    if (error && process.env.NODE_ENV === 'development' && userId && !preferences) {
      console.warn('Using mock preferences data due to error');
      setPreferences({
        id: 'mock-id',
        userId: userId,
        emailNotifications: true,
        reminderAdvanceNotice: 24,
        reminderTime: '09:00:00',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }, [error, userId, preferences]);

  return {
    preferences,
    setPreferences,
    loading,
    setLoading,
    error,
    setError,
    initialLoadAttempted
  };
};
