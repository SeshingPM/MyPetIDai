
import React, { memo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useHealth } from '@/contexts/health';
import { usePets } from '@/contexts/PetsContext';
import FadeIn from '@/components/animations/FadeIn';
import OptimizedHealthSectionHeader from './health/OptimizedHealthSectionHeader';
import HealthSectionContent from './health/HealthSectionContent';

const OptimizedHealthSection: React.FC = () => {
  const { healthRecords, vaccinations, loading } = useHealth();
  const { pets } = usePets();
  
  // Calculate basic health stats - memoized with useMemo in real implementation
  const totalPets = pets.filter(pet => !pet.archived).length;
  const petsWithHealthRecords = new Set(healthRecords.map(record => record.petId)).size;
  const petsWithVaccinations = new Set(vaccinations.map(vax => vax.petId)).size;
  
  // Determine health status based on records and vaccinations
  const getHealthStatus = () => {
    if (totalPets === 0) return 'neutral';
    
    const healthCompleteness = totalPets > 0 
      ? Math.round((petsWithHealthRecords / totalPets) * 100) 
      : 0;
    
    const vaccinationCompleteness = totalPets > 0 
      ? Math.round((petsWithVaccinations / totalPets) * 100) 
      : 0;
    
    if (healthCompleteness === 100 && vaccinationCompleteness >= 75) return 'good';
    if (healthCompleteness >= 50 && vaccinationCompleteness >= 50) return 'fair';
    return 'needs-attention';
  };
  
  const healthStatus = getHealthStatus();
  
  return (
    <FadeIn delay={200} direction="none">
      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white via-white to-gray-50 h-full">
        {/* Reduced size of decorative background elements for mobile performance */}
        <CardHeader className="pb-1">
          <OptimizedHealthSectionHeader healthStatus={healthStatus} />
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

export default memo(OptimizedHealthSection);
