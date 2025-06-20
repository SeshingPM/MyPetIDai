import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * Type for weight unit options
 */
export type WeightUnit = 'lbs' | 'kg';

/**
 * Context interface for weight unit preferences
 */
interface WeightUnitContextType {
  weightUnit: WeightUnit;
  setWeightUnit: (unit: WeightUnit) => void;
  toggleWeightUnit: () => void;
}

const WeightUnitContext = createContext<WeightUnitContextType | undefined>(undefined);

/**
 * Provider component for weight unit preferences
 */
export const WeightUnitProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(() => {
    // Initialize from localStorage if available
    const savedUnit = localStorage.getItem('preferredWeightUnit');
    return (savedUnit as WeightUnit) || 'lbs';
  });

  // Persist to localStorage when changed
  useEffect(() => {
    localStorage.setItem('preferredWeightUnit', weightUnit);
  }, [weightUnit]);

  const toggleWeightUnit = () => {
    setWeightUnit(prevUnit => prevUnit === 'lbs' ? 'kg' : 'lbs');
  };

  return (
    <WeightUnitContext.Provider value={{ weightUnit, setWeightUnit, toggleWeightUnit }}>
      {children}
    </WeightUnitContext.Provider>
  );
};

/**
 * Hook to access the weight unit context
 */
export const useWeightUnit = (): WeightUnitContextType => {
  const context = useContext(WeightUnitContext);
  if (context === undefined) {
    throw new Error('useWeightUnit must be used within a WeightUnitProvider');
  }
  return context;
};
