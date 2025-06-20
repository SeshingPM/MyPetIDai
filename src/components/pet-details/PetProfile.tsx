
import React from 'react';
import { Button } from '@/components/ui/button';
import { Archive } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';
import PetPhoto from './profile/PetPhoto';
import PetDetails from './profile/PetDetails';

interface Pet {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  photoUrl: string;
}

interface PetProfileProps {
  pet: Pet;
  onDelete: () => void;
}

const PetProfile: React.FC<PetProfileProps> = ({ pet, onDelete }) => {
  return (
    <div className="w-full md:w-1/3">
      <GlassCard>
        <PetPhoto id={pet.id} name={pet.name} photoUrl={pet.photoUrl} />
        <PetDetails id={pet.id} name={pet.name} breed={pet.breed} birthDate={pet.birthDate} />
      </GlassCard>
      
      <div className="mt-6">
        <Button variant="outline" className="w-full" onClick={onDelete}>
          <Archive size={16} className="mr-2" />
          Archive Pet
        </Button>
      </div>
    </div>
  );
};

export default PetProfile;
