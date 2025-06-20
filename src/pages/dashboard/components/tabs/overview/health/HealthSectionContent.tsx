
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HealthProgressBar from './HealthProgressBar';

interface HealthSectionContentProps {
  loading: boolean;
  petsWithHealthRecords: number;
  petsWithVaccinations: number;
  totalPets: number;
}

const HealthSectionContent: React.FC<HealthSectionContentProps> = ({
  loading,
  petsWithHealthRecords,
  petsWithVaccinations,
  totalPets
}) => {
  return (
    <>
      {loading ? (
        <div className="h-16 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading health data...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HealthProgressBar 
            label="Health Records" 
            value={petsWithHealthRecords}
            total={totalPets}
          />
          
          <HealthProgressBar 
            label="Vaccinations" 
            value={petsWithVaccinations}
            total={totalPets}
          />
        </div>
      )}
      
      <div className="mt-3 flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link to="/health-check">View Health Check</Link>
        </Button>
      </div>
    </>
  );
};

export default HealthSectionContent;
