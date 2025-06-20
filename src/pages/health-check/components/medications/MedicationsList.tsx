import React, { useState } from 'react';
import { Medication } from '@/utils/types';
import { Calendar, ChevronDown, ChevronUp, Clock, MoreHorizontal, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, isAfter, isBefore } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MedicationsListProps {
  medications: Medication[];
  onEdit: (medication: Medication) => void;
  onDelete: (id: string) => void;
}

const MedicationsList: React.FC<MedicationsListProps> = ({ 
  medications,
  onEdit,
  onDelete 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Sort medications by start date, most recent first
  const sortedMedications = [...medications].sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
    return dateB - dateA;
  });
  
  // Categorize medications as active, upcoming, or completed
  const today = new Date();
  
  const activeMedications = sortedMedications.filter(med => {
    const hasStarted = !med.startDate || isBefore(new Date(med.startDate), today);
    const notEnded = !med.endDate || isAfter(new Date(med.endDate), today);
    return hasStarted && notEnded;
  });
  
  const upcomingMedications = sortedMedications.filter(med => 
    med.startDate && isAfter(new Date(med.startDate), today)
  );
  
  const completedMedications = sortedMedications.filter(med => 
    med.endDate && isBefore(new Date(med.endDate), today)
  );
  
  // Display only first 3 unless expanded
  const displayMedications = expanded 
    ? sortedMedications 
    : sortedMedications.slice(0, 3);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Medication status summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/30 rounded-md text-sm">
        <div className="flex items-center mb-2 sm:mb-0">
          <Pill className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2 flex-shrink-0" />
          <span className="font-medium">
            {activeMedications.length === 0 
              ? "No active medications" 
              : `${activeMedications.length} active medication${activeMedications.length !== 1 ? 's' : ''}`}
          </span>
        </div>
        
        {upcomingMedications.length > 0 && (
          <div className="flex items-center text-xs sm:text-sm">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-amber-500 flex-shrink-0" />
            <span>{upcomingMedications.length} upcoming</span>
          </div>
        )}
      </div>
      
      {/* Medications list */}
      <div>
        {displayMedications.map((medication) => (
          <div key={medication.id} className="border-b border-gray-100 py-3 last:border-0">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-sm sm:text-base">{medication.name}</h4>
                
                {medication.dosage && (
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Dosage: {medication.dosage}
                    {medication.frequency && ` - ${medication.frequency}`}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-x-2 text-xs sm:text-sm text-muted-foreground mt-1">
                  {medication.startDate && (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Start: {format(new Date(medication.startDate), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  
                  {medication.endDate && (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>End: {format(new Date(medication.endDate), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
                
                {medication.notes && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {medication.notes}
                  </p>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(medication)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(medication.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
        
        {sortedMedications.length > 3 && (
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
                Show All ({sortedMedications.length})
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MedicationsList;
