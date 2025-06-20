
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Vaccination } from '@/utils/types';
import { useHealth } from '@/contexts/health';
import { toast } from 'sonner';
import VaccinationsList from './VaccinationsList';
import VaccinationDialog from './VaccinationDialog';
import VaccinationRemindersManager from './VaccinationRemindersManager';
import { categorizeVaccinations } from './utils/dateUtils';
import VaccinationStatus from './VaccinationStatus';

interface VaccinationSectionProps {
  petId: string;
  petName: string;
}

const VaccinationSection: React.FC<VaccinationSectionProps> = ({
  petId,
  petName
}) => {
  const { getVaccinationsForPet, deleteVaccination } = useHealth();
  const vaccinations = getVaccinationsForPet(petId);
  
  // Get categorized vaccinations
  const { overdue, upcoming } = categorizeVaccinations(vaccinations);
  
  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState<Vaccination | null>(null);
  
  // Handle opening edit dialog
  const handleEdit = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination);
    setIsEditDialogOpen(true);
  };
  
  // Handle deletion
  const handleDelete = async (id: string) => {
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
    <Card className="mb-4 sm:mb-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 pb-2 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl mb-3 sm:mb-0">Vaccinations</CardTitle>
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          size="sm" 
          className="w-full sm:w-auto"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Vaccination
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-2 sm:pt-0">
        {/* Vaccination Reminders Manager */}
        {(overdue.length > 0 || upcoming.length > 0) && (
          <VaccinationRemindersManager
            vaccinations={vaccinations}
            petId={petId}
            petName={petName}
          />
        )}
        
        {/* Vaccination status overview */}
        {vaccinations.length > 0 && (
          <div className="mb-6">
            <VaccinationStatus
              vaccinations={vaccinations}
              overdueCount={overdue.length}
              upcomingCount={upcoming.length}
            />
          </div>
        )}
        
        {vaccinations.length > 0 ? (
          <VaccinationsList 
            vaccinations={vaccinations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            No vaccination records available for {petName}. Add vaccinations to track their health protection status.
          </p>
        )}
      </CardContent>
      
      {/* Dialogs */}
      <VaccinationDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        petId={petId}
        petName={petName}
        mode="add"
      />
      
      {selectedVaccination && (
        <VaccinationDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          petId={petId}
          petName={petName}
          mode="edit"
          vaccination={selectedVaccination}
        />
      )}
    </Card>
  );
};

export default VaccinationSection;
