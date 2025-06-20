
import { useMemo } from 'react';
import { Reminder } from '../types';
import { filterReminders } from '../utils';

/**
 * Custom hook to memoize filtered reminders to prevent unnecessary recomputation
 * Only re-computes when the reminders array changes
 */
export const useMemoizedReminders = (reminders: Reminder[]) => {
  return useMemo(() => {
    return filterReminders(reminders);
  }, [reminders]);
};
