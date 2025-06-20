
import { Vaccination } from '@/utils/types';
import { addMonths, isBefore, isAfter } from 'date-fns';

/**
 * Categorizes vaccinations into overdue, upcoming, and current
 */
export const categorizeVaccinations = (vaccinations: Vaccination[]) => {
  const today = new Date();
  const threeMonthsFromNow = addMonths(today, 3);
  
  const overdue = vaccinations.filter(v => 
    v.expirationDate && isBefore(new Date(v.expirationDate), today)
  );
  
  const upcoming = vaccinations.filter(v => 
    v.expirationDate && 
    isAfter(new Date(v.expirationDate), today) && 
    isBefore(new Date(v.expirationDate), threeMonthsFromNow)
  );
  
  const current = vaccinations.filter(v => 
    !v.expirationDate || 
    isAfter(new Date(v.expirationDate), threeMonthsFromNow)
  );
  
  return { overdue, upcoming, current };
};

/**
 * Calculates days until a vaccination expires
 */
export const getDaysUntilExpiration = (expirationDate: string | undefined): number | null => {
  if (!expirationDate) return null;
  
  const expDate = new Date(expirationDate);
  const today = new Date();
  
  // Set both dates to midnight for accurate day calculation
  expDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};
