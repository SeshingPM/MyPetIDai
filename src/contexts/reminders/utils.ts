
import { Reminder } from './types';

export const categorizeDates = (today: Date) => {
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return {
    today,
    tomorrow,
    
    isTodayReminder: (reminder: Reminder) => {
      const reminderDate = new Date(reminder.date);
      reminderDate.setHours(0, 0, 0, 0);
      return reminderDate.getTime() === today.getTime();
    },
    
    isUpcomingReminder: (reminder: Reminder) => {
      const reminderDate = new Date(reminder.date);
      reminderDate.setHours(0, 0, 0, 0);
      return reminderDate.getTime() > today.getTime();
    },
    
    isOverdueReminder: (reminder: Reminder) => {
      const reminderDate = new Date(reminder.date);
      reminderDate.setHours(0, 0, 0, 0);
      return reminderDate.getTime() < today.getTime();
    }
  };
};

export const filterReminders = (reminders: Reminder[]) => {
  const activeReminders = reminders.filter(reminder => !reminder.archived);
  const archivedReminders = reminders.filter(reminder => reminder.archived);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { isTodayReminder, isUpcomingReminder, isOverdueReminder } = categorizeDates(today);
  
  const todayReminders = activeReminders.filter(isTodayReminder);
  const upcomingReminders = activeReminders.filter(isUpcomingReminder);
  const overdueReminders = activeReminders.filter(isOverdueReminder);
  
  return {
    activeReminders,
    archivedReminders,
    todayReminders,
    upcomingReminders,
    overdueReminders,
  };
};
