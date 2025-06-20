
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PetCard from '@/components/pets/PetCard';
import { Plus, PawPrint, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePets } from '@/contexts/pets';
import { useIsMobile } from '@/hooks/use-mobile';
import PetsListSkeleton from '../PetsListSkeleton';

interface ActivePetsTabProps {
  searchQuery: string;
  onAddPet: () => void;
}

const ActivePetsTab: React.FC<ActivePetsTabProps> = ({ searchQuery, onAddPet }) => {
  const navigate = useNavigate();
  const { pets, loading: petsLoading } = usePets();
  const isMobile = useIsMobile();
  const [photoLoading, setPhotoLoading] = useState(true);
  
  // Compute a combined loading state
  const shouldShowSkeleton = petsLoading || photoLoading;
  
  // Check if we're coming from a page refresh
  useEffect(() => {
    // Use sessionStorage to detect if we're coming from a photo update
    const isPhotoUpdated = sessionStorage.getItem('photoUpdated');
    
    if (isPhotoUpdated === 'true') {
      // Show loading state for a moment
      setPhotoLoading(true);
      
      // Clear the flag
      sessionStorage.removeItem('photoUpdated');
      
      // After a short delay, show the content
      const timer = setTimeout(() => {
        setPhotoLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      // If not coming from a photo update, don't show photo loading state
      setPhotoLoading(false);
    }
  }, []);
  
  const filteredPets = pets.filter(pet => 
    !pet.archived && 
    (searchQuery === '' || 
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handlePetCardClick = (petId: string) => {
    navigate(`/pets/${petId}`);
  };
  
  // Show skeleton loader during loading state
  if (shouldShowSkeleton) {
    return <PetsListSkeleton />;
  }
  
  if (filteredPets.length === 0) {
    return (
      <div className="col-span-full text-center py-10 md:py-16">
        {searchQuery ? (
          <>
            <Search size={isMobile ? 36 : 48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No pets found</h3>
            <p className="text-gray-500">
              No pets match your search for "{searchQuery}".
            </p>
          </>
        ) : (
          <>
            <PawPrint size={isMobile ? 36 : 48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No pets added yet</h3>
            <p className="text-gray-500 mb-6">
              Add your first pet to start tracking their information and health records.
            </p>
            <Button onClick={onAddPet}>
              <Plus size={16} className="mr-2" />
              Add Your First Pet
            </Button>
          </>
        )}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {filteredPets.map((pet) => (
        <div key={pet.id} onClick={() => handlePetCardClick(pet.id)} className="cursor-pointer">
          <PetCard pet={pet} />
        </div>
      ))}
      
      <div 
        className="flex items-center justify-center aspect-[3/2] cursor-pointer border rounded-lg bg-gray-50 hover:bg-gray-100" 
        onClick={onAddPet}
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Plus size={24} className="text-primary" />
          </div>
          <h3 className="font-medium text-gray-700">Add New Pet</h3>
        </div>
      </div>
    </div>
  );
};

export default ActivePetsTab;
