
import { useState, useCallback } from 'react';
import { deletePetFromSupabase } from '../api';
import { saveArchivedPetsToLocalStorage } from '../utils';
import { Pet } from '../types';
import { toast } from 'sonner';

// Global Set to track processed pet IDs across component re-renders
const globalProcessedDeleteIds = new Set<string>();

export const usePermanentlyDeletePet = (
  userId: string | undefined,
  archivedPets: Pet[],
  setArchivedPets: React.Dispatch<React.SetStateAction<Pet[]>>
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const permanentlyDeletePet = useCallback(async (id: string): Promise<void> => {
    console.log('permanentlyDeletePet called for ID:', id);
    
    if (!userId) {
      toast.error('You must be logged in to delete a pet');
      return;
    }

    // Prevent duplicate operations on the same pet
    if (isDeleting || globalProcessedDeleteIds.has(id)) {
      console.log(`Skipping duplicate delete operation for pet ${id}`);
      return;
    }

    // Mark as processing to prevent duplicates
    globalProcessedDeleteIds.add(id);
    setIsDeleting(true);
    
    try {
      // Find the pet to delete for the toast message
      const petToDelete = archivedPets.find(pet => pet.id === id);
      
      if (!petToDelete) {
        toast.error('Pet not found');
        return;
      }
      
      // Delete from database
      await deletePetFromSupabase(id);
      
      // Update local state
      const updatedArchivedPets = archivedPets.filter(pet => pet.id !== id);
      setArchivedPets(updatedArchivedPets);
      
      // Backup to localStorage
      saveArchivedPetsToLocalStorage(updatedArchivedPets);
      
      // Show success message
      toast.success(`${petToDelete.name} has been permanently deleted`);
      
    } catch (error) {
      console.error('Error permanently deleting pet:', error);
      toast.error('Failed to delete pet. Please try again.');
      
      // Fallback to local state update even if the API call fails
      const updatedArchivedPets = archivedPets.filter(pet => pet.id !== id);
      setArchivedPets(updatedArchivedPets);
      saveArchivedPetsToLocalStorage(updatedArchivedPets);
    } finally {
      setIsDeleting(false);
      
      // Remove from the global processed set after a delay
      setTimeout(() => {
        globalProcessedDeleteIds.delete(id);
      }, 2000);
    }
  }, [userId, archivedPets, setArchivedPets, isDeleting]);

  return { permanentlyDeletePet, isDeleting };
};
