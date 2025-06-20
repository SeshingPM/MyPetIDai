
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Archive } from 'lucide-react';
import ActivePetsTab from './tabs/ActivePetsTab';
import ArchivedPetsTab from './tabs/ArchivedPetsTab';
import { usePets } from '@/contexts/pets';

interface PetsTabsProps {
  searchQuery: string;
  activeTab: 'active' | 'archived';
  onTabChange: (value: string) => void;
  onAddPet: () => void;
}

const PetsTabs: React.FC<PetsTabsProps> = ({ 
  searchQuery, 
  activeTab, 
  onTabChange, 
  onAddPet 
}) => {
  const { archivedPets } = usePets();
  
  return (
    <Tabs 
      defaultValue="active" 
      value={activeTab}
      onValueChange={onTabChange}
      className="mb-6"
    >
      <TabsList>
        <TabsTrigger value="active">Active Pets</TabsTrigger>
        <TabsTrigger value="archived">
          <Archive size={16} className="mr-2" />
          Archived Pets ({archivedPets.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="active">
        <ActivePetsTab searchQuery={searchQuery} onAddPet={onAddPet} />
      </TabsContent>
      
      <TabsContent value="archived">
        <ArchivedPetsTab searchQuery={searchQuery} />
      </TabsContent>
    </Tabs>
  );
};

export default PetsTabs;
