
import React, { useState } from 'react';
import PetsHeader from './components/PetsHeader';
import PetsSearch from './components/PetsSearch';
import PetsTabs from './components/PetsTabs';
import FadeIn from '@/components/animations/FadeIn';
import { useNavigate } from 'react-router-dom';
import AddPetForm from '@/components/pets/AddPetForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const PetsPageContent: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [isAddPetDialogOpen, setIsAddPetDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="relative isolate overflow-hidden">
        {/* Modern background blurs like dashboard */}
        <div className="absolute -top-40 -right-20 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute top-60 -left-20 w-80 h-80 bg-pet-purple/20 rounded-full filter blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 right-10 w-60 h-60 bg-pet-blue/20 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        
        <FadeIn delay={100}>
          <PetsHeader onAddPet={() => setIsAddPetDialogOpen(true)} />
        </FadeIn>
        
        <FadeIn delay={200}>
          <div className="mb-6">
            <PetsSearch searchQuery={search} onSearchChange={setSearch} />
          </div>
        </FadeIn>
        
        <FadeIn delay={300}>
          <PetsTabs 
            searchQuery={search} 
            activeTab={activeTab}
            onTabChange={(value) => setActiveTab(value as 'active' | 'archived')}
            onAddPet={() => setIsAddPetDialogOpen(true)}
          />
        </FadeIn>
      </div>
      
      {/* Add Pet Dialog */}
      <Dialog open={isAddPetDialogOpen} onOpenChange={setIsAddPetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <AddPetForm
            onSuccess={(petId) => {
              setIsAddPetDialogOpen(false);
              if (petId) {
                navigate(`/pets/${petId}`);
              }
            }}
            onCancel={() => setIsAddPetDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PetsPageContent;
