
import React from 'react';
import { usePets } from '@/contexts/PetsContext';
import PetCard from '@/components/pets/PetCard';
import GlassCard from '@/components/ui-custom/GlassCard';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FadeIn from '@/components/animations/FadeIn';
import { useDialogs } from '../../contexts/DialogContext';

const PetsTab: React.FC = () => {
  const { pets, refetchPets } = usePets();
  const navigate = useNavigate();
  const { openAddPetDialog } = useDialogs();
  
  // Filter out archived pets
  const activePets = pets.filter(pet => !pet.archived);

  return (
    <FadeIn>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
        {activePets.length > 0 ? (
          activePets.map((pet) => (
            <PetCard 
              key={pet.id} 
              pet={pet} 
              onClick={() => navigate(`/pets/${pet.id}`)}
            />
          ))
        ) : (
          <GlassCard className="col-span-full flex flex-col items-center justify-center py-6 sm:py-8 text-center">
            <div className="text-center">
              <h3 className="font-medium text-gray-700 mb-2">No active pets</h3>
              <p className="text-gray-500 text-sm mb-4">Add your first pet to get started</p>
            </div>
          </GlassCard>
        )}
        
        <GlassCard 
          className="flex items-center justify-center aspect-[3/2] cursor-pointer" 
          onClick={openAddPetDialog}
        >
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Plus size={20} className="text-primary" />
            </div>
            <h3 className="font-medium text-gray-700 text-sm">Add New Pet</h3>
          </div>
        </GlassCard>
      </div>
    </FadeIn>
  );
};

export default PetsTab;
