
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import { Medication } from '@/utils/types';
import { useHealth } from '@/contexts/health';
import { toast } from 'sonner';
import MedicationsList from './MedicationsList';
import MedicationDialog from './MedicationDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MedicationSectionProps {
  petId: string;
  petName: string;
}

const MedicationSection: React.FC<MedicationSectionProps> = ({
  petId,
  petName
}) => {
  const { getMedicationsForPet, deleteMedication, loading } = useHealth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [localLoading, setLocalLoading] = useState(true);
  
  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  
  // Fetch medications and handle errors
  useEffect(() => {
    try {
      const petMedications = getMedicationsForPet(petId);
      setMedications(petMedications);
      setError(null);
    } catch (err) {
      console.error("Error fetching medications:", err);
      setError(err instanceof Error ? err : new Error("Failed to load medications"));
    } finally {
      setLocalLoading(false);
    }
  }, [petId, getMedicationsForPet, loading]);
  
  // Handle opening edit dialog
  const handleEdit = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsEditDialogOpen(true);
  };
  
  // Handle deletion
  const handleDelete = async (id: string) => {
    try {
      const success = await deleteMedication(id);
      if (success) {
        toast.success('Medication deleted successfully');
      } else {
        toast.error('Failed to delete medication');
      }
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast.error('Failed to delete medication');
    }
  };

  // Show loading state
  if (loading || localLoading) {
    return (
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="p-4 pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Medications</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 sm:pt-0">
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">Loading medications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="p-4 pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Medications</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 sm:pt-0">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || "Failed to load medications. Please try again."}
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 pb-2 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl mb-3 sm:mb-0">Medications</CardTitle>
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          size="sm" 
          className="w-full sm:w-auto"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Medication
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-2 sm:pt-0">
        {medications.length > 0 ? (
          <MedicationsList 
            medications={medications}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <p className="text-sm text-muted-foreground py-4">
            No medication records available for {petName}. Add medications to track their treatment regimen.
          </p>
        )}
      </CardContent>
      
      {/* Dialogs */}
      <MedicationDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        petId={petId}
        petName={petName}
        mode="add"
      />
      
      {selectedMedication && (
        <MedicationDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          petId={petId}
          petName={petName}
          mode="edit"
          medication={selectedMedication}
        />
      )}
    </Card>
  );
};

export default MedicationSection;
