/**
 * Calculates the age in years from a given birth date string
 * 
 * @param birthDateStr - ISO format date string (YYYY-MM-DD)
 * @returns The age in years as a number
 */
export function calculateAge(birthDateStr: string): number {
  if (!birthDateStr) return 0;
  
  try {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    
    // Return 0 if birth date is in the future or invalid
    if (isNaN(birthDate.getTime()) || birthDate > today) {
      return 0;
    }
    
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Adjust age if the birthday hasn't occurred yet this year
    const hasBirthdayOccurredThisYear = (
      today.getMonth() > birthDate.getMonth() || 
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())
    );
    
    if (!hasBirthdayOccurredThisYear) {
      age--;
    }
    
    return Math.max(0, age);
  } catch (error) {
    console.error('Error calculating age:', error);
    return 0;
  }
}

/**
 * Calculates the age in months from a given birth date string
 * 
 * @param birthDateStr - ISO format date string (YYYY-MM-DD)
 * @returns The age in months as a number
 */
export function calculateAgeInMonths(birthDateStr: string): number {
  if (!birthDateStr) return 0;
  
  try {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    
    // Return 0 if birth date is in the future or invalid
    if (isNaN(birthDate.getTime()) || birthDate > today) {
      return 0;
    }
    
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months += today.getMonth() - birthDate.getMonth();
    
    // Adjust for day of month
    if (today.getDate() < birthDate.getDate()) {
      months--;
    }
    
    return Math.max(0, months);
  } catch (error) {
    console.error('Error calculating age in months:', error);
    return 0;
  }
}

/**
 * Format the age with the appropriate suffix (year/years or month/months)
 * 
 * @param age - The age in years
 * @returns Formatted age string with appropriate suffix
 */
export function formatAge(age: number): string {
  // If pet is less than 1 year old, show age in months
  if (age === 0) {
    const ageInMonths = calculateAgeInMonths(calculateBirthDateFromAge(age));
    if (ageInMonths === 1) {
      return '1 month';
    } else if (ageInMonths === 0) {
      return 'Less than 1 month';
    } else {
      return `${ageInMonths} months`;
    }
  } else if (age === 1) {
    return '1 year';
  } else {
    return `${age} years`;
  }
}

/**
 * Format the age with appropriate units based on a birth date
 * 
 * @param birthDateStr - ISO format date string (YYYY-MM-DD)
 * @returns Formatted age string with appropriate units (years or months)
 */
export function formatAgeFromBirthDate(birthDateStr: string): string {
  if (!birthDateStr) return '0 years';
  
  try {
    const ageInYears = calculateAge(birthDateStr);
    
    if (ageInYears === 0) {
      const ageInMonths = calculateAgeInMonths(birthDateStr);
      if (ageInMonths === 0) {
        return 'Less than 1 month';
      } else if (ageInMonths === 1) {
        return '1 month';
      } else {
        return `${ageInMonths} months`;
      }
    } else if (ageInYears === 1) {
      return '1 year';
    } else {
      return `${ageInYears} years`;
    }
  } catch (error) {
    console.error('Error formatting age from birth date:', error);
    return '0 years';
  }
}

/**
 * Helper function to generate a birth date string from an age in years
 * This is only used internally for the formatAge function
 * 
 * @param ageInYears - The age in years
 * @returns ISO format date string (YYYY-MM-DD)
 */
function calculateBirthDateFromAge(ageInYears: number): string {
  const today = new Date();
  const birthDate = new Date(today);
  birthDate.setFullYear(today.getFullYear() - ageInYears);
  return birthDate.toISOString().split('T')[0];
}

/**
 * Calculate and format the age from a birth date string
 * 
 * @param birthDateStr - ISO format date string (YYYY-MM-DD)
 * @returns Formatted age string with appropriate suffix
 */
export function getFormattedAge(birthDateStr: string): string {
  return formatAgeFromBirthDate(birthDateStr);
}
