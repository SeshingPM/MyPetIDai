
import { Vaccination, NewVaccinationData } from '@/utils/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface UseVaccinationsProps {
  user: User | null;
  fetchHealthData: () => Promise<void>;
}

export const useVaccinations = ({ user, fetchHealthData }: UseVaccinationsProps) => {
  // Add a new vaccination
  const addVaccination = async (vaccination: NewVaccinationData): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data: newVaccination, error } = await supabase
        .from('vaccinations')
        .insert({
          pet_id: vaccination.petId,
          user_id: user.id,
          name: vaccination.name,
          date_administered: vaccination.dateAdministered,
          expiration_date: vaccination.expirationDate,
          administrator: vaccination.administrator,
          batch_number: vaccination.batchNumber,
          notes: vaccination.notes,
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh data
      await fetchHealthData();
      return newVaccination.id;
    } catch (error) {
      console.error('Error adding vaccination:', error);
      toast.error('Failed to add vaccination. Please try again.');
      return null;
    }
  };

  // Update an existing vaccination
  const updateVaccination = async (id: string, vaccination: Partial<Vaccination>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('vaccinations')
        .update({
          name: vaccination.name,
          date_administered: vaccination.dateAdministered,
          expiration_date: vaccination.expirationDate,
          administrator: vaccination.administrator,
          batch_number: vaccination.batchNumber,
          notes: vaccination.notes,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh data
      await fetchHealthData();
      return true;
    } catch (error) {
      console.error('Error updating vaccination:', error);
      toast.error('Failed to update vaccination. Please try again.');
      return false;
    }
  };

  // Delete a vaccination
  const deleteVaccination = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('vaccinations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh data
      await fetchHealthData();
      return true;
    } catch (error) {
      console.error('Error deleting vaccination:', error);
      toast.error('Failed to delete vaccination. Please try again.');
      return false;
    }
  };

  return {
    addVaccination,
    updateVaccination,
    deleteVaccination
  };
};
