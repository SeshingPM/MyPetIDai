
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { usePets } from '@/contexts/PetsContext';
import FadeIn from '@/components/animations/FadeIn';
import { useDialogs } from '../../../contexts/DialogContext';
import PetsSectionHeader from './pets/PetsSectionHeader';
import PetsSectionContent from './pets/PetsSectionContent';
import PetsEmptyState from './pets/PetsEmptyState';
import PetsSectionSkeleton from './pets/PetsSectionSkeleton';

const PetsSection: React.FC = () => {
  const { pets, loading: petsLoading } = usePets();
  const { openAddPetDialog } = useDialogs();
  const [isLoading, setIsLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  
  // Effect to handle loading state
  useEffect(() => {
    // Check if we're coming from a photo update
    const isPhotoUpdated = sessionStorage.getItem('photoUpdated');
    
    if (isPhotoUpdated === 'true') {
      // Show loading state for a moment
      setIsLoading(true);
      
      // After a short delay, show the content
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (!petsLoading) {
      // Immediately set loading to false if pets data is ready
      setIsLoading(false);
    }
  }, [petsLoading]);
  
  // Effect to track when data is actually ready to be displayed
  useEffect(() => {
    // Only consider data ready when pets have loaded AND our local loading state is complete
    if (!petsLoading && !isLoading) {
      // Set data ready immediately since we've already handled loading states properly
      setDataReady(true);
    } else {
      // Reset dataReady when loading starts again
      setDataReady(false);
    }
  }, [petsLoading, isLoading]);
  
  // Filter out archived pets for the overview using useMemo to prevent unnecessary recalculations
  const activePets = useMemo(() => {
    return pets.filter(pet => !pet.archived);
  }, [pets]);

  return (
    <FadeIn delay={300}>
      <Card className="bg-white/90 shadow-sm border-gray-100 overflow-hidden relative h-full">
        {/* Reduced size background decoration elements */}
        <div className="absolute top-0 right-0 h-28 w-28 bg-pet-blue/30 rounded-full -mr-8 -mt-8 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 h-20 w-20 bg-pet-purple/20 rounded-full -ml-6 -mb-6 blur-2xl"></div>
        
        <CardHeader className="pb-0 pt-3">
          <PetsSectionHeader 
            title="Your Pets" 
            description="Manage your pet profiles and information" 
          />
        </CardHeader>
        
        <CardContent className="relative z-10 pt-2 pb-3">
          {!dataReady || isLoading || petsLoading ? (
            <PetsSectionSkeleton />
          ) : activePets.length > 0 ? (
            <PetsSectionContent />
          ) : (
            <PetsEmptyState onAddPet={openAddPetDialog} />
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
};

export default PetsSection;
