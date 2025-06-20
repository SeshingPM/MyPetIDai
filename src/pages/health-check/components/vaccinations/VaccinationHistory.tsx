
import React, { useState } from 'react';
import { Vaccination } from '@/utils/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useHealth } from '@/contexts/health';
import VaccinationHistoryItem from './VaccinationHistoryItem';

interface VaccinationHistoryProps {
  vaccinations: Vaccination[];
  petName: string;
}

const VaccinationHistory: React.FC<VaccinationHistoryProps> = ({ vaccinations, petName }) => {
  const [expanded, setExpanded] = useState(false);
  const { deleteVaccination } = useHealth();
  
  // Sort vaccinations by most recent first
  const sortedVaccinations = [...vaccinations].sort((a, b) => {
    return new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime();
  });
  
  // Display only 3 unless expanded
  const displayVaccinations = expanded 
    ? sortedVaccinations 
    : sortedVaccinations.slice(0, 3);

  const handleDeleteVaccination = async (id: string) => {
    try {
      const success = await deleteVaccination(id);
      if (success) {
        toast.success('Vaccination deleted successfully');
      } else {
        toast.error('Failed to delete vaccination');
      }
    } catch (error) {
      console.error('Error deleting vaccination:', error);
      toast.error('Failed to delete vaccination');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Vaccination History</h3>
      </div>
      
      <div className="space-y-3">
        {displayVaccinations.map((vaccination) => (
          <VaccinationHistoryItem
            key={vaccination.id}
            vaccination={vaccination}
            petName={petName}
            onDelete={handleDeleteVaccination}
          />
        ))}
        
        {sortedVaccinations.length > 3 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show All ({sortedVaccinations.length})
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default VaccinationHistory;
