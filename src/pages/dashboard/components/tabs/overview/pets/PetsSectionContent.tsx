
import React from 'react';
import { usePets } from '@/contexts/PetsContext';
import PetCard from '@/components/pets/PetCard';
import { useNavigate } from 'react-router-dom';

const PetsSectionContent: React.FC = () => {
  const { pets } = usePets();
  const navigate = useNavigate();
  
  // Filter out archived pets for the overview
  const activePets = pets.filter(pet => !pet.archived);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {activePets.slice(0, 4).map((pet) => (
        <PetCard 
          key={pet.id} 
          pet={pet} 
          onClick={() => navigate(`/pets/${pet.id}`)}
        />
      ))}
    </div>
  );
};

export default PetsSectionContent;
