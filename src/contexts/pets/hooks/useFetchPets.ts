
import { useState, useCallback } from 'react';
import { fetchPetsFromSupabase } from '../api';
import { getPetsFromLocalStorage, getArchivedPetsFromLocalStorage } from '../utils';
import { Pet } from '../types';
import { toast } from 'sonner';

export const useFetchPets = (
  userId: string | undefined,
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>,
  setArchivedPets: React.Dispatch<React.SetStateAction<Pet[]>>
) => {
  const [loading, setLoading] = useState(true);

  const fetchPets = useCallback(async (): Promise<void> => {
    if (!userId) {
      setPets([]);
      setArchivedPets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch from Supabase
      const { active, archived } = await fetchPetsFromSupabase(userId);
      
      setPets(active);
      setArchivedPets(archived);
    } catch (error) {
      console.error('Error loading pets from Supabase:', error);
      toast.error('Failed to load pets. Please refresh the page.');
      
      // Fallback to localStorage if Supabase fails
      try {
        const storedPets = getPetsFromLocalStorage();
        const storedArchivedPets = getArchivedPetsFromLocalStorage();
        
        if (storedPets.length > 0) {
          setPets(storedPets);
        }
        
        if (storedArchivedPets.length > 0) {
          setArchivedPets(storedArchivedPets);
        }
      } catch (localError) {
        console.error('Error loading pets from localStorage:', localError);
      }
    } finally {
      setLoading(false);
    }
  }, [userId, setPets, setArchivedPets]);

  return { fetchPets, loading };
};
