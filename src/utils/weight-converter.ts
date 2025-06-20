/**
 * Converts weight from pounds to kilograms
 */
export const lbsToKg = (weightInLbs: number): number => {
  return weightInLbs / 2.20462;
};

/**
 * Converts weight from kilograms to pounds
 */
export const kgToLbs = (weightInKg: number): number => {
  return weightInKg * 2.20462;
};

/**
 * Formats weight with the appropriate unit
 */
export const formatWeight = (weight: number | undefined, unit: 'lbs' | 'kg'): string => {
  if (weight === undefined) return 'N/A';
  
  const value = Number(weight.toFixed(2));
  return `${value} ${unit}`;
};
