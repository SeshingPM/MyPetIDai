
import { useState } from 'react';
import { updatePetInSupabase } from '../api';
import { savePetsToLocalStorage } from '../utils';
import { Pet } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useUpdatePet = (
  userId: string | undefined,
  pets: Pet[],
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>
) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updatePet = async (id: string, petData: Partial<Omit<Pet, 'id'>> & { photoFile?: File }): Promise<void> => {
    if (!userId) {
      toast.error('You must be logged in to update a pet');
      return;
    }

    setIsUpdating(true);
    try {
      let updatedPhotoUrl = petData.photoUrl;

      // If there's a new photo file, upload it to storage
      if (petData.photoFile) {
        const fileExt = petData.photoFile.name.split('.').pop();
        const filePath = `${userId}/${id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('pet-photos')
          .upload(filePath, petData.photoFile);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('pet-photos')
          .getPublicUrl(filePath);
          
        updatedPhotoUrl = urlData.publicUrl;
      }

      // Prepare the data for the update without the photoFile property
      const { photoFile, ...dataToUpdate } = petData;
      
      // Update with the final photo URL
      await updatePetInSupabase(id, { 
        ...dataToUpdate, 
        photoUrl: updatedPhotoUrl 
      });
      
      // Update in local state
      const updatedPets = pets.map(pet => 
        pet.id === id ? { 
          ...pet, 
          ...dataToUpdate,
          photoUrl: updatedPhotoUrl || pet.photoUrl
        } : pet
      );
      setPets(updatedPets);
      
      // Backup to localStorage
      savePetsToLocalStorage(updatedPets);
      
      toast.success('Pet updated successfully');
    } catch (error) {
      console.error('Error updating pet:', error);
      toast.error('Failed to update pet. Please try again.');
      
      // Fallback to localStorage
      try {
        const { photoFile, ...dataToUpdate } = petData;
        const updatedPets = pets.map(pet => 
          pet.id === id ? { ...pet, ...dataToUpdate } : pet
        );
        setPets(updatedPets);
        savePetsToLocalStorage(updatedPets);
      } catch (localError) {
        console.error('Error updating pet in localStorage:', localError);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return { updatePet, isUpdating };
};
