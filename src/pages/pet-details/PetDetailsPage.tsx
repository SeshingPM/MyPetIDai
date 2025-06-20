
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import { ReminderProvider } from '@/contexts/reminders';
import { HealthProvider } from '@/contexts/health';
import { usePets } from '@/contexts/pets';
import PetDetailsContent from './PetDetailsContent';
import PetNotFound from './PetNotFound';
import PetDetailsSkeleton from './PetDetailsSkeleton';

const PetDetailsPage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const [loading, setLoading] = useState(true);
  const { pets, archivedPets } = usePets();
  
  useEffect(() => {
    // Check if we're coming from a photo update
    const isPhotoUpdated = sessionStorage.getItem('photoUpdated');
    
    if (isPhotoUpdated === 'true') {
      // Keep loading state active longer for the skeleton to be visible
      const timer = setTimeout(() => {
        setLoading(false);
        // Clear the flag
        sessionStorage.removeItem('photoUpdated');
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      // If not coming from a photo update, use a shorter loading time
      // but still show skeleton briefly to prevent flashing
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [petId, pets, archivedPets]);
  
  // Find the pet in either active or archived pets
  const pet = petId 
    ? [...pets, ...archivedPets].find(p => p.id === petId) || null 
    : null;
  
  // Always show skeleton during loading
  if (loading) {
    return (
      <DashboardLayout>
        <Header />
        <PetDetailsSkeleton />
      </DashboardLayout>
    );
  }
  
  // Only show Pet Not Found after loading is complete
  if (!pet) {
    return <PetNotFound />;
  }

  // Convert the pet to match the expected interface by using birthDate
  const petWithBirthDate = {
    ...pet,
    birthDate: pet.birthDate
  };

  return (
    <DashboardLayout>
      <Header />
      <HealthProvider>
        <ReminderProvider>
          <PetDetailsContent pet={petWithBirthDate} />
        </ReminderProvider>
      </HealthProvider>
    </DashboardLayout>
  );
};

export default PetDetailsPage;
