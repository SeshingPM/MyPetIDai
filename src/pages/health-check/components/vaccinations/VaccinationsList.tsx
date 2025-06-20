
import React, { useState } from 'react';
import { Vaccination } from '@/utils/types';
import { AlertTriangle, CheckCircle2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VaccinationItem from './VaccinationItem';
import { categorizeVaccinations } from './utils/dateUtils';

interface VaccinationsListProps {
  vaccinations: Vaccination[];
  onEdit: (vaccination: Vaccination) => void;
  onDelete: (id: string) => void;
}

const VaccinationsList: React.FC<VaccinationsListProps> = ({ 
  vaccinations,
  onEdit,
  onDelete 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Sort vaccinations by most recent first
  const sortedVaccinations = [...vaccinations].sort((a, b) => {
    return new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime();
  });
  
  // Get only overdue vaccinations
  const { overdue, upcoming } = categorizeVaccinations(sortedVaccinations);
  
  // Display only first 3 unless expanded
  const displayVaccinations = expanded 
    ? sortedVaccinations 
    : sortedVaccinations.slice(0, 3);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Vaccination status summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/30 rounded-md text-sm">
        <div className="flex items-center mb-2 sm:mb-0">
          {overdue.length > 0 ? (
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 mr-2 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" />
          )}
          <span className="font-medium">
            {overdue.length > 0 
              ? `${overdue.length} vaccinations overdue` 
              : "All vaccinations up to date"
            }
          </span>
        </div>
        
        {upcoming.length > 0 && (
          <div className="flex items-center text-xs sm:text-sm">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-amber-500 flex-shrink-0" />
            <span>{upcoming.length} upcoming</span>
          </div>
        )}
      </div>
      
      {/* Vaccination list - removed max-height/overflow to fix scrollbox */}
      <div>
        {displayVaccinations.map((vaccination) => (
          <VaccinationItem
            key={vaccination.id}
            vaccination={vaccination}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        
        {sortedVaccinations.length > 3 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-xs sm:text-sm h-8" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Show All ({sortedVaccinations.length})
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default VaccinationsList;
