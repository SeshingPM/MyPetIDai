
import { HealthRecord, NewHealthRecordData } from '@/utils/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface UseHealthRecordsProps {
  user: User | null;
  fetchHealthData: () => Promise<void>;
}

export const useHealthRecords = ({ user, fetchHealthData }: UseHealthRecordsProps) => {
  // Add a new health record
  const addHealthRecord = async (record: NewHealthRecordData): Promise<string | null> => {
    if (!user) return null;

    try {
      // Insert health record
      const { data: newRecord, error: recordError } = await supabase
        .from('health_records')
        .insert({
          pet_id: record.petId,
          user_id: user.id,
          weight: record.weight,
          notes: record.notes,
          record_date: record.recordDate,
        })
        .select()
        .single();

      if (recordError) throw recordError;

      // Insert medications if provided
      if (record.medications && record.medications.length > 0) {
        const medicationsToInsert = record.medications.map(med => ({
          health_record_id: newRecord.id,
          pet_id: record.petId,
          user_id: user.id,
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          start_date: med.startDate,
          end_date: med.endDate,
          notes: med.notes,
        }));

        const { error: medError } = await supabase
          .from('medications')
          .insert(medicationsToInsert);

        if (medError) throw medError;
      }

      // Refresh data
      await fetchHealthData();
      return newRecord.id;
    } catch (error) {
      console.error('Error adding health record:', error);
      toast.error('Failed to add health record. Please try again.');
      return null;
    }
  };

  // Update an existing health record
  const updateHealthRecord = async (id: string, record: Partial<HealthRecord>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('health_records')
        .update({
          weight: record.weight,
          notes: record.notes,
          record_date: record.recordDate,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh data
      await fetchHealthData();
      return true;
    } catch (error) {
      console.error('Error updating health record:', error);
      toast.error('Failed to update health record. Please try again.');
      return false;
    }
  };

  // Delete a health record
  const deleteHealthRecord = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Delete the health record (associated medications will be deleted via cascade)
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh data
      await fetchHealthData();
      return true;
    } catch (error) {
      console.error('Error deleting health record:', error);
      toast.error('Failed to delete health record. Please try again.');
      return false;
    }
  };

  return {
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord
  };
};
