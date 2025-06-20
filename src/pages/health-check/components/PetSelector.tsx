
import React from 'react';
import { Pet } from '@/contexts/pets/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

interface PetSelectorProps {
  pets: Pet[];
  selectedPetId: string | undefined;
  onSelectPet: (petId: string) => void;
}

const PetSelector: React.FC<PetSelectorProps> = ({ 
  pets, 
  selectedPetId, 
  onSelectPet 
}) => {
  const navigate = useNavigate();
  
  const handlePetChange = (petId: string) => {
    onSelectPet(petId);
    // Update URL parameter
    navigate(`/health-check?pet=${petId}`);
  };
  
  return (
    <div className="w-full sm:max-w-md mx-auto">
      <Select 
        value={selectedPetId} 
        onValueChange={handlePetChange}
        disabled={pets.length === 0}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a pet" />
        </SelectTrigger>
        <SelectContent>
          {pets.map(pet => (
            <SelectItem key={pet.id} value={pet.id}>
              {pet.name} {pet.breed ? `(${pet.breed})` : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PetSelector;
