
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useHealth } from '@/contexts/health';
import { usePets } from '@/contexts/PetsContext';
import FadeIn from '@/components/animations/FadeIn';
import HealthSectionHeader from './health/HealthSectionHeader';
import HealthSectionContent from './health/HealthSectionContent';

const HealthSection: React.FC = () => {
  const { healthRecords, vaccinations, loading } = useHealth();
  const { pets } = usePets();
  
  // Calculate basic health stats
  const totalPets = pets.length;
  const petsWithHealthRecords = new Set(healthRecords.map(record => record.petId)).size;
  const petsWithVaccinations = new Set(vaccinations.map(vax => vax.petId)).size;
  
  // Calculate health completeness percentage
  const healthCompleteness = totalPets > 0 
    ? Math.round((petsWithHealthRecords / totalPets) * 100) 
    : 0;
  
  // Calculate vaccination completeness
  const vaccinationCompleteness = totalPets > 0 
    ? Math.round((petsWithVaccinations / totalPets) * 100) 
    : 0;
    
  // Determine health status based on records and vaccinations
  const getHealthStatus = () => {
    if (totalPets === 0) return 'neutral';
    if (healthCompleteness === 100 && vaccinationCompleteness >= 75) return 'good';
    if (healthCompleteness >= 50 && vaccinationCompleteness >= 50) return 'fair';
    return 'needs-attention';
  };
  
  const healthStatus = getHealthStatus();
  
  return (
    <FadeIn delay={200}>
      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white via-white to-gray-50 h-full">
        {/* Reduced size of decorative background elements */}
        <div className="absolute top-5 right-5 h-20 w-20 bg-pet-green/10 rounded-full blur-xl opacity-50"></div>
        <div className="absolute bottom-5 left-5 h-16 w-16 bg-pet-blue/10 rounded-full blur-xl opacity-50"></div>
        
        <CardHeader className="pb-1">
          <HealthSectionHeader healthStatus={healthStatus} />
        </CardHeader>
        
        <CardContent className="pb-3 relative z-10">
          <HealthSectionContent
            loading={loading}
            petsWithHealthRecords={petsWithHealthRecords}
            petsWithVaccinations={petsWithVaccinations}
            totalPets={totalPets}
          />
        </CardContent>
      </Card>
    </FadeIn>
  );
};

export default HealthSection;
