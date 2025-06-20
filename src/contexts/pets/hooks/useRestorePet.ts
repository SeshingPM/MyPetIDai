
import { useState, useRef, useEffect } from 'react';
import { restorePetInSupabase } from '../api';
import { savePetsToLocalStorage, saveArchivedPetsToLocalStorage } from '../utils';
import { Pet } from '../types';
import { toast } from 'sonner';

// Global Set to track processed pet IDs across component re-renders
// This prevents duplicate operations when components re-render
const globalProcessedPetIds = new Set<string>();

export const useRestorePet = (
  userId: string | undefined,
  pets: Pet[],
  archivedPets: Pet[],
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>,
  setArchivedPets: React.Dispatch<React.SetStateAction<Pet[]>>
) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const isMounted = useRef(true);
  const toastShownRef = useRef<Set<string>>(new Set());
  
  // Reset mounted state on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const restorePet = async (id: string): Promise<void> => {
    if (!userId) {
      toast.error('You must be logged in to restore a pet');
      return;
    }

    // Prevent duplicate operations on the same pet
    if (isRestoring || globalProcessedPetIds.has(id)) {
      console.log(`Skipping duplicate restore operation for pet ${id}`);
      return;
    }

    // Mark as processing to prevent duplicates
    globalProcessedPetIds.add(id);
    
    // Only set state if component is still mounted
    if (isMounted.current) {
      setIsRestoring(true);
    }
    
    try {
      // Find the pet to restore
      const petToRestore = archivedPets.find(pet => pet.id === id);
      
      if (!petToRestore) {
        toast.error('Archived pet not found');
        return;
      }
      
      // Update in database
      await restorePetInSupabase(id);
      
      // Remove archived flag
      const restoredPet = { ...petToRestore, archived: false };
      
      // Add to active pets
      const updatedPets = [...pets, restoredPet];
      
      // Remove from archived pets
      const updatedArchivedPets = archivedPets.filter(pet => pet.id !== id);
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setPets(updatedPets);
        setArchivedPets(updatedArchivedPets);
      }
      
      // Backup to localStorage
      savePetsToLocalStorage(updatedPets);
      saveArchivedPetsToLocalStorage(updatedArchivedPets);
      
      // Show toast only once per operation using the toastShownRef
      if (!toastShownRef.current.has(id)) {
        toastShownRef.current.add(id);
        toast.success(`${petToRestore.name} has been restored from archive`);
        
        // Clear the toast ID after a delay to allow future operations
        setTimeout(() => {
          toastShownRef.current.delete(id);
        }, 2000);
      }
    } catch (error) {
      console.error('Error restoring pet:', error);
      
      // Only show error toast if not already shown
      if (!toastShownRef.current.has(`error-${id}`)) {
        toastShownRef.current.add(`error-${id}`);
        toast.error('Failed to restore pet. Please try again.');
        
        setTimeout(() => {
          toastShownRef.current.delete(`error-${id}`);
        }, 2000);
      }
      
      // Fallback to localStorage
      try {
        const petToRestore = archivedPets.find(pet => pet.id === id);
        if (petToRestore && isMounted.current) {
          const restoredPet = { ...petToRestore, archived: false };
          setPets(prev => [...prev, restoredPet]);
          setArchivedPets(prev => prev.filter(pet => pet.id !== id));
          
          savePetsToLocalStorage([...pets, restoredPet]);
          saveArchivedPetsToLocalStorage(archivedPets.filter(pet => pet.id !== id));
        }
      } catch (localError) {
        console.error('Error restoring pet to localStorage:', localError);
      }
    } finally {
      // Only reset state if component is still mounted
      if (isMounted.current) {
        setIsRestoring(false);
      }
      
      // Remove from the global processed set after a delay
      // This allows for future operations on the same pet if needed
      setTimeout(() => {
        globalProcessedPetIds.delete(id);
      }, 2000);
    }
  };

  return { restorePet, isRestoring };
};
