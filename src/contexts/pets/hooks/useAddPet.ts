import { useState, useRef } from 'react';
import { addPetToSupabase } from '../api';
import { createPetInLocalStorage, savePetsToLocalStorage } from '../utils';
import { Pet, NewPetData } from '../types';
import { toast } from 'sonner';

export const useAddPet = (
  userId: string | undefined,
  pets: Pet[],
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>
) => {
  const [isAdding, setIsAdding] = useState(false);
  const operationInProgressRef = useRef(false);

  const addPet = async (petData: NewPetData): Promise<string | null> => {
    console.log('addPet called with data:', petData);
    
    if (!userId) {
      toast.error('You must be logged in to add a pet');
      return null;
    }

    // Extra protection against duplicate operations
    if (isAdding || operationInProgressRef.current) {
      console.log('Already adding a pet, ignoring duplicate call');
      return null;
    }

    setIsAdding(true);
    operationInProgressRef.current = true;
    
    try {
      console.log('Attempting to add pet to Supabase');
      // Try with Supabase first
      const newPet = await addPetToSupabase(userId, petData);
      console.log('Pet successfully added to Supabase:', newPet);
      
      // Update local state - create a new array to ensure React detects the change
      setPets(prevPets => [...prevPets, newPet]);
      
      // Backup to localStorage
      const updatedPets = [...pets, newPet];
      savePetsToLocalStorage(updatedPets);
      
      return newPet.id;
    } catch (error) {
      console.error('Error adding pet:', error);
      
      // Fallback to localStorage
      try {
        console.log('Falling back to localStorage for pet creation');
        const newPet = createPetInLocalStorage(petData, petData.photoFile);
        
        // Update state with a new array
        setPets(prevPets => [...prevPets, newPet]);
        
        // Save to localStorage
        const updatedPets = [...pets, newPet];
        savePetsToLocalStorage(updatedPets);
        
        return newPet.id;
      } catch (localError) {
        console.error('Error adding pet to localStorage:', localError);
        return null;
      }
    } finally {
      setIsAdding(false);
      // Small delay to ensure UI has time to update
      setTimeout(() => {
        operationInProgressRef.current = false;
      }, 500);
    }
  };

  return { addPet, isAdding };
};
