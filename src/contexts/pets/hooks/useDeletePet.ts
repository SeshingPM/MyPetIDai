
import { useState, useRef, useEffect } from 'react';
import { archivePetInSupabase } from '../api';
import { savePetsToLocalStorage, saveArchivedPetsToLocalStorage } from '../utils';
import { Pet } from '../types';
import { toast } from 'sonner';

// Global Set to track processed pet IDs across component re-renders
// This prevents duplicate operations when components re-render
const globalProcessedArchiveIds = new Set<string>();

export const useDeletePet = (
  userId: string | undefined,
  pets: Pet[],
  archivedPets: Pet[],
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>,
  setArchivedPets: React.Dispatch<React.SetStateAction<Pet[]>>
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isMounted = useRef(true);
  const toastShownRef = useRef<Set<string>>(new Set());
  
  // Reset mounted state on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const deletePet = async (id: string): Promise<void> => {
    if (!userId) {
      toast.error('You must be logged in to archive a pet');
      return;
    }

    // Prevent duplicate operations on the same pet
    if (isDeleting || globalProcessedArchiveIds.has(id)) {
      console.log(`Skipping duplicate archive operation for pet ${id}`);
      return;
    }

    // Mark as processing to prevent duplicates
    globalProcessedArchiveIds.add(id);
    
    // Only set state if component is still mounted
    if (isMounted.current) {
      setIsDeleting(true);
    }
    
    try {
      // Find the pet to archive
      const petToArchive = pets.find(pet => pet.id === id);
      
      if (!petToArchive) {
        toast.error('Pet not found');
        return;
      }
      
      // Update in database
      await archivePetInSupabase(id);
      
      // Mark as archived and move to archived pets
      const archivedPet = { ...petToArchive, archived: true };
      const updatedArchivedPets = [...archivedPets, archivedPet];
      
      // Remove from active pets
      const updatedPets = pets.filter(pet => pet.id !== id);
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setArchivedPets(updatedArchivedPets);
        setPets(updatedPets);
      }
      
      // Backup to localStorage
      saveArchivedPetsToLocalStorage(updatedArchivedPets);
      savePetsToLocalStorage(updatedPets);
      
      // Show toast only once per operation using the toastShownRef
      if (!toastShownRef.current.has(id)) {
        toastShownRef.current.add(id);
        toast.success(`${petToArchive.name} has been moved to archived pets`);
        
        // Clear the toast ID after a delay to allow future operations
        setTimeout(() => {
          toastShownRef.current.delete(id);
        }, 2000);
      }
    } catch (error) {
      console.error('Error archiving pet:', error);
      
      // Only show error toast if not already shown
      if (!toastShownRef.current.has(`error-${id}`)) {
        toastShownRef.current.add(`error-${id}`);
        toast.error('Failed to archive pet. Please try again.');
        
        setTimeout(() => {
          toastShownRef.current.delete(`error-${id}`);
        }, 2000);
      }
      
      // Fallback to localStorage
      try {
        const petToArchive = pets.find(pet => pet.id === id);
        if (petToArchive && isMounted.current) {
          const archivedPet = { ...petToArchive, archived: true };
          setArchivedPets(prev => [...prev, archivedPet]);
          setPets(prev => prev.filter(pet => pet.id !== id));
          
          saveArchivedPetsToLocalStorage([...archivedPets, archivedPet]);
          savePetsToLocalStorage(pets.filter(pet => pet.id !== id));
        }
      } catch (localError) {
        console.error('Error archiving pet to localStorage:', localError);
      }
    } finally {
      // Only reset state if component is still mounted
      if (isMounted.current) {
        setIsDeleting(false);
      }
      
      // Remove from the global processed set after a delay
      // This allows for future operations on the same pet if needed
      setTimeout(() => {
        globalProcessedArchiveIds.delete(id);
      }, 2000);
    }
  };

  return { deletePet, isDeleting };
};
