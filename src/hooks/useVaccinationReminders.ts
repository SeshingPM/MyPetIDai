
import { useEffect, useState } from 'react';
import { Vaccination } from '@/utils/types';
import { useReminders } from '@/contexts/reminders';
import { addDays, isAfter, isBefore, differenceInDays } from 'date-fns';

export const useVaccinationReminders = (
  vaccinations: Vaccination[],
  petId: string,
  petName: string
) => {
  const { reminders, handleAddReminder } = useReminders();
  const [overdueVaccinations, setOverdueVaccinations] = useState<Vaccination[]>([]);
  const [upcomingVaccinations, setUpcomingVaccinations] = useState<Vaccination[]>([]);
  
  // Filter and categorize vaccinations
  useEffect(() => {
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);
    
    // Overdue vaccinations
    const overdue = vaccinations.filter(
      vax => vax.expirationDate && isBefore(new Date(vax.expirationDate), today)
    );
    
    // Upcoming vaccinations in the next 30 days
    const upcoming = vaccinations.filter(
      vax => vax.expirationDate && 
        isAfter(new Date(vax.expirationDate), today) && 
        isBefore(new Date(vax.expirationDate), thirtyDaysFromNow)
    );
    
    setOverdueVaccinations(overdue);
    setUpcomingVaccinations(upcoming);
  }, [vaccinations]);
  
  // Create a reminder for a vaccination
  const createVaccinationReminder = (vaccination: Vaccination) => {
    if (!vaccination.expirationDate) return;
    
    const dueDate = new Date(vaccination.expirationDate);
    
    // Add reminder 2 weeks before due date, or today if it's already past that point
    const reminderDate = new Date();
    const twoWeeksBefore = addDays(dueDate, -14);
    
    if (isAfter(twoWeeksBefore, reminderDate)) {
      reminderDate.setTime(twoWeeksBefore.getTime());
    }
    
    const daysUntilDue = differenceInDays(dueDate, reminderDate);
    
    handleAddReminder({
      title: `Vaccination due: ${vaccination.name}`,
      date: reminderDate,
      petId,
      notes: `${vaccination.name} vaccination for ${petName} is due in ${daysUntilDue} days.`,
    });
  };
  
  return {
    overdueVaccinations,
    upcomingVaccinations,
    createVaccinationReminder,
  };
};
