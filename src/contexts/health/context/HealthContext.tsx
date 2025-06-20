
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { HealthRecord, Medication, Vaccination, MedicalEvent } from '@/utils/types';
import { useFetchHealthData } from '../hooks/useFetchHealthData';
import { useHealthRecords } from '../hooks/useHealthRecords';
import { useMedications } from '../hooks/useMedications';
import { useVaccinations } from '../hooks/useVaccinations';
import { useMedicalEvents } from '../hooks/useMedicalEvents';

// Health context type definition
interface HealthContextType {
  healthRecords: HealthRecord[];
  medications: Medication[];
  vaccinations: Vaccination[];
  medicalEvents: MedicalEvent[];
  loading: boolean;
  addHealthRecord: ReturnType<typeof useHealthRecords>['addHealthRecord'];
  updateHealthRecord: ReturnType<typeof useHealthRecords>['updateHealthRecord'];
  deleteHealthRecord: ReturnType<typeof useHealthRecords>['deleteHealthRecord'];
  addMedication: ReturnType<typeof useMedications>['addMedication'];
  updateMedication: ReturnType<typeof useMedications>['updateMedication'];
  deleteMedication: ReturnType<typeof useMedications>['deleteMedication'];
  addVaccination: ReturnType<typeof useVaccinations>['addVaccination'];
  updateVaccination: ReturnType<typeof useVaccinations>['updateVaccination'];
  deleteVaccination: ReturnType<typeof useVaccinations>['deleteVaccination'];
  addMedicalEvent: ReturnType<typeof useMedicalEvents>['addMedicalEvent'];
  updateMedicalEvent: ReturnType<typeof useMedicalEvents>['updateMedicalEvent'];
  deleteMedicalEvent: ReturnType<typeof useMedicalEvents>['deleteMedicalEvent'];
  refetchHealthData: () => Promise<void>;
  getHealthRecordsForPet: (petId: string) => HealthRecord[];
  getMedicationsForPet: (petId: string) => Medication[];
  getVaccinationsForPet: (petId: string) => Vaccination[];
  getMedicalEventsForPet: (petId: string) => MedicalEvent[];
}

// Create the context
const HealthContext = createContext<HealthContextType | undefined>(undefined);

// Hook for using the health context
export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

// Props for the health provider
interface HealthProviderProps {
  children: ReactNode;
}

// Health provider component
export const HealthProvider: React.FC<HealthProviderProps> = ({ children }) => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [medicalEvents, setMedicalEvents] = useState<MedicalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch health data hook
  const { fetchHealthData } = useFetchHealthData({
    user,
    setHealthRecords,
    setMedications,
    setVaccinations,
    setMedicalEvents,
    setLoading
  });

  // CRUD operations for health records
  const { addHealthRecord, updateHealthRecord, deleteHealthRecord } = useHealthRecords({
    user,
    fetchHealthData
  });

  // CRUD operations for medications
  const { addMedication, updateMedication, deleteMedication } = useMedications({
    user,
    fetchHealthData
  });
  
  // CRUD operations for vaccinations
  const { addVaccination, updateVaccination, deleteVaccination } = useVaccinations({
    user,
    fetchHealthData
  });
  
  // CRUD operations for medical events
  const { addMedicalEvent, updateMedicalEvent, deleteMedicalEvent } = useMedicalEvents({
    user,
    fetchHealthData
  });

  // Helper functions to filter records by pet
  const getHealthRecordsForPet = (petId: string): HealthRecord[] => {
    return healthRecords.filter(record => record.petId === petId);
  };

  const getMedicationsForPet = (petId: string): Medication[] => {
    return medications.filter(med => med.petId === petId);
  };
  
  const getVaccinationsForPet = (petId: string): Vaccination[] => {
    return vaccinations.filter(vax => vax.petId === petId);
  };
  
  const getMedicalEventsForPet = (petId: string): MedicalEvent[] => {
    return medicalEvents.filter(event => event.petId === petId);
  };
  
  // Load health data when the user changes
  useEffect(() => {
    fetchHealthData();
  }, [user]);

  // Create context value with all the functionality
  const contextValue: HealthContextType = {
    healthRecords,
    medications,
    vaccinations,
    medicalEvents,
    loading,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    addMedication,
    updateMedication,
    deleteMedication,
    addVaccination,
    updateVaccination,
    deleteVaccination,
    addMedicalEvent,
    updateMedicalEvent,
    deleteMedicalEvent,
    refetchHealthData: fetchHealthData,
    getHealthRecordsForPet,
    getMedicationsForPet,
    getVaccinationsForPet,
    getMedicalEventsForPet,
  };

  return (
    <HealthContext.Provider value={contextValue}>
      {children}
    </HealthContext.Provider>
  );
};
