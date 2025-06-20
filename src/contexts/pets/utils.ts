
import { Pet } from './types';

// Save pets to localStorage as backup
export const savePetsToLocalStorage = (pets: Pet[]) => {
  if (pets.length > 0) {
    localStorage.setItem('pets', JSON.stringify(pets));
  }
};

// Save archived pets to localStorage as backup
export const saveArchivedPetsToLocalStorage = (archivedPets: Pet[]) => {
  if (archivedPets.length > 0) {
    localStorage.setItem('archivedPets', JSON.stringify(archivedPets));
  }
};

// Get pets from localStorage
export const getPetsFromLocalStorage = (): Pet[] => {
  try {
    const storedPets = localStorage.getItem('pets');
    return storedPets ? JSON.parse(storedPets) : [];
  } catch (error) {
    console.error('Error loading pets from localStorage:', error);
    return [];
  }
};

// Get archived pets from localStorage
export const getArchivedPetsFromLocalStorage = (): Pet[] => {
  try {
    const storedArchivedPets = localStorage.getItem('archivedPets');
    return storedArchivedPets ? JSON.parse(storedArchivedPets) : [];
  } catch (error) {
    console.error('Error loading archived pets from localStorage:', error);
    return [];
  }
};

// Create a new pet in localStorage when Supabase fails
export const createPetInLocalStorage = (petData: any, photoFile?: File): Pet => {
  return {
    id: Date.now().toString(),
    name: petData.name,
    breed: petData.breed,
    birthDate: petData.birthDate,
    photoUrl: photoFile ? URL.createObjectURL(photoFile) : '',
    archived: false
  };
};
