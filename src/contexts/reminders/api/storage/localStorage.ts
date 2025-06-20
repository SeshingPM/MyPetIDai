
import { Reminder } from '../../types';

export const getRemindersFromLocalStorage = (): Reminder[] | null => {
  try {
    const storedReminders = localStorage.getItem('reminders');
    if (storedReminders) {
      // Parse reminders and convert date strings back to Date objects
      return JSON.parse(storedReminders, (key, value) => {
        // Convert date strings back to Date objects
        if (key === 'date' && typeof value === 'string') {
          return new Date(value);
        }
        return value;
      });
    }
  } catch (error) {
    console.error('Error loading reminders from localStorage:', error);
  }
  return null;
};

export const saveRemindersToLocalStorage = (reminders: Reminder[]): void => {
  if (reminders.length > 0) {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }
};
