
// Export the HealthContext and HealthProvider from the context file
export { useHealth, HealthProvider } from './context/HealthContext';

// Export the types from the utils/types module
export type { HealthRecord, Medication, Vaccination, MedicalEvent } from '@/utils/types';

// Also export the types and utilities
export * from './utils/healthDataMappers';
