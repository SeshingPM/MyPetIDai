
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Pet, PetsContextType } from './types';
import { savePetsToLocalStorage, saveArchivedPetsToLocalStorage } from './utils';
import { useAddPet } from './hooks/useAddPet';
import { useDeletePet } from './hooks/useDeletePet';
import { useRestorePet } from './hooks/useRestorePet';
import { usePermanentlyDeletePet } from './hooks/usePermanentlyDeletePet';
import { useUpdatePet } from './hooks/useUpdatePet';
import { useFetchPets } from './hooks/useFetchPets';

const PetsContext = createContext<PetsContextType | undefined>(undefined);

export const usePets = () => {
  const context = useContext(PetsContext);
  if (!context) {
    throw new Error('usePets must be used within a PetsProvider');
  }
  return context;
};

interface PetsProviderProps {
  children: ReactNode;
}

export const PetsProvider: React.FC<PetsProviderProps> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [archivedPets, setArchivedPets] = useState<Pet[]>([]);
  const { user } = useAuth();
  const userId = user?.id;
  const isMountedRef = useRef(true);
  const isRefetchingRef = useRef(false);

  // Initialize hooks with the state and setters
  const { fetchPets, loading } = useFetchPets(userId, setPets, setArchivedPets);
  const { addPet, isAdding } = useAddPet(userId, pets, setPets);
  const { deletePet } = useDeletePet(userId, pets, archivedPets, setPets, setArchivedPets);
  const { restorePet } = useRestorePet(userId, pets, archivedPets, setPets, setArchivedPets);
  const { permanentlyDeletePet } = usePermanentlyDeletePet(userId, archivedPets, setArchivedPets);
  const { updatePet } = useUpdatePet(userId, pets, setPets);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Load pets when the user changes
  useEffect(() => {
    if (userId) {
      fetchPets();
    }
  }, [userId]);

  // Memoized refetch function to avoid unnecessary re-renders
  const refetchPets = useCallback(async () => {
    if (isRefetchingRef.current) {
      return;
    }
    
    isRefetchingRef.current = true;
    
    try {
      await fetchPets();
    } finally {
      // Only update if component is still mounted
      if (isMountedRef.current) {
        isRefetchingRef.current = false;
      }
    }
  }, [userId, fetchPets]);

  // Save pets to localStorage as backup
  useEffect(() => {
    if (pets.length > 0) {
      savePetsToLocalStorage(pets);
    }
  }, [pets]);

  useEffect(() => {
    if (archivedPets.length > 0) {
      saveArchivedPetsToLocalStorage(archivedPets);
    }
  }, [archivedPets]);

  // Create the context value with all the operations
  const contextValue: PetsContextType = {
    pets,
    archivedPets,
    addPet,
    deletePet,
    updatePet,
    restorePet,
    permanentlyDeletePet,
    loading,
    refetchPets
  };

  return (
    <PetsContext.Provider value={contextValue}>
      {children}
    </PetsContext.Provider>
  );
};
