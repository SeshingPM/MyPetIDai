
import React, { useCallback, useRef, useEffect } from 'react';
import PetCard from '@/components/pets/PetCard';
import { Button } from '@/components/ui/button';
import { Archive } from 'lucide-react';
import { usePets } from '@/contexts/pets';
import { toast } from 'sonner';
import PetsListSkeleton from '../PetsListSkeleton';

interface ArchivedPetsTabProps {
  searchQuery: string;
}

const ArchivedPetsTab: React.FC<ArchivedPetsTabProps> = ({ searchQuery }) => {
  console.log('ArchivedPetsTab rendering, checking if context is available');
  const { archivedPets, restorePet, permanentlyDeletePet, loading: archivedPetsLoading } = usePets();
  console.log('ArchivedPets loaded from context:', archivedPets?.length);
  
  const processingRef = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    console.log('ArchivedPetsTab mounted');
    return () => {
      console.log('ArchivedPetsTab unmounted');
    };
  }, []);
  
  // Show skeleton loader while archived pets are loading
  if (archivedPetsLoading) {
    return <PetsListSkeleton />;
  }
  
  const filteredArchivedPets = archivedPets.filter(pet => 
    searchQuery === '' || 
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleRestorePet = useCallback((event: React.MouseEvent, petId: string) => {
    event.stopPropagation();
    event.preventDefault();
    
    // Extra protection against duplicate operations
    if (processingRef.current.has(petId)) {
      console.log('Already processing this pet, skipping duplicate action');
      return;
    }
    
    processingRef.current.add(petId);
    console.log('Calling restorePet for:', petId);
    restorePet(petId);
    
    // Remove from processing after a delay
    setTimeout(() => {
      processingRef.current.delete(petId);
    }, 2000);
  }, [restorePet]);
  
  const handlePermanentDelete = useCallback((event: React.MouseEvent, petId: string) => {
    event.stopPropagation();
    event.preventDefault();
    
    // Extra protection against duplicate operations
    if (processingRef.current.has(petId)) {
      console.log('Already processing this pet, skipping duplicate action');
      return;
    }
    
    if (window.confirm('Permanently delete this pet? This cannot be undone.')) {
      processingRef.current.add(petId);
      console.log('Calling permanentlyDeletePet for:', petId);
      permanentlyDeletePet(petId);
      
      // Remove from processing after a delay
      setTimeout(() => {
        processingRef.current.delete(petId);
      }, 2000);
    }
  }, [permanentlyDeletePet]);
  
  console.log('Filtered archived pets count:', filteredArchivedPets.length);
  
  if (filteredArchivedPets.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <Archive size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No archived pets</h3>
        <p className="text-gray-500">
          Archived pets will appear here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredArchivedPets.map((pet) => (
        <div key={pet.id} className="relative group">
          <PetCard 
            pet={pet} 
            className="opacity-80 hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity rounded-lg">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={(e) => handleRestorePet(e, pet.id)}
            >
              Restore
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={(e) => handlePermanentDelete(e, pet.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArchivedPetsTab;
