
import { HealthRecord, Medication, Vaccination, MedicalEvent } from '@/utils/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { healthDataService } from '../services/healthDataService';
import { mapHealthRecords, mapMedications, mapVaccinations, mapMedicalEvents } from '../utils/healthDataMappers';

interface UseFetchHealthDataProps {
  user: User | null;
  setHealthRecords: React.Dispatch<React.SetStateAction<HealthRecord[]>>;
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
  setVaccinations: React.Dispatch<React.SetStateAction<Vaccination[]>>;
  setMedicalEvents: React.Dispatch<React.SetStateAction<MedicalEvent[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useFetchHealthData = ({
  user,
  setHealthRecords,
  setMedications,
  setVaccinations,
  setMedicalEvents,
  setLoading
}: UseFetchHealthDataProps) => {
  // Fetch health records, medications, vaccinations, and medical events
  const fetchHealthData = async () => {
    if (!user) {
      setHealthRecords([]);
      setMedications([]);
      setVaccinations([]);
      setMedicalEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch all health data in parallel
      const [healthData, medicationData, vaccinationData, eventData] = await Promise.all([
        healthDataService.fetchHealthRecords(user.id),
        healthDataService.fetchMedications(user.id),
        healthDataService.fetchVaccinations(user.id),
        healthDataService.fetchMedicalEvents(user.id)
      ]);

      // Map the data to our application interfaces
      const mappedHealthRecords = mapHealthRecords(healthData);
      const mappedMedications = mapMedications(medicationData);
      const mappedVaccinations = mapVaccinations(vaccinationData);
      const mappedMedicalEvents = mapMedicalEvents(eventData);

      // Update state with the mapped data
      setHealthRecords(mappedHealthRecords);
      setMedications(mappedMedications);
      setVaccinations(mappedVaccinations);
      setMedicalEvents(mappedMedicalEvents);
    } catch (error) {
      console.error('Error fetching health data:', error);
      toast.error('Failed to load health records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { fetchHealthData };
};
