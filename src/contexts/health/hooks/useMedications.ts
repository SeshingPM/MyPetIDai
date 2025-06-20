
import { Medication, NewMedicationData } from '@/utils/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface UseMedicationsProps {
  user: User | null;
  fetchHealthData: () => Promise<void>;
}

export const useMedications = ({ user, fetchHealthData }: UseMedicationsProps) => {
  // Add a new medication
  const addMedication = async (medication: NewMedicationData & { petId: string }): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data: newMedication, error } = await supabase
        .from('medications')
        .insert({
          pet_id: medication.petId,
          user_id: user.id,
          health_record_id: medication.healthRecordId,
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          start_date: medication.startDate,
          end_date: medication.endDate,
          notes: medication.notes,
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh data
      await fetchHealthData();
      return newMedication.id;
    } catch (error) {
      console.error('Error adding medication:', error);
      toast.error('Failed to add medication. Please try again.');
      return null;
    }
  };

  // Update an existing medication
  const updateMedication = async (id: string, medication: Partial<Medication>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('medications')
        .update({
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          start_date: medication.startDate,
          end_date: medication.endDate,
          notes: medication.notes,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh data
      await fetchHealthData();
      return true;
    } catch (error) {
      console.error('Error updating medication:', error);
      toast.error('Failed to update medication. Please try again.');
      return false;
    }
  };

  // Delete a medication
  const deleteMedication = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh data
      await fetchHealthData();
      return true;
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast.error('Failed to delete medication. Please try again.');
      return false;
    }
  };

  return {
    addMedication,
    updateMedication,
    deleteMedication
  };
};
