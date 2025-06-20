
import React, { useState } from 'react';
import { type Medication } from '@/contexts/health';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { useHealth } from '@/contexts/health';
import { toast } from 'sonner';
import EditMedicationDialog from './EditMedicationDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface MedicationListProps {
  medications: Medication[];
}

const MedicationList: React.FC<MedicationListProps> = ({ medications }) => {
  const { deleteMedication } = useHealth();
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handleEditMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteMedication = async (id: string) => {
    try {
      const success = await deleteMedication(id);
      if (success) {
        toast.success('Medication deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast.error('Failed to delete medication');
    }
  };
  
  if (medications.length === 0) {
    return <p className="text-gray-500">No medications found</p>;
  }
  
  return (
    <>
      <div className="space-y-3">
        {medications.map((medication) => (
          <Card key={medication.id} className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{medication.name}</h4>
                  
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    {medication.dosage && (
                      <p><span className="font-medium">Dosage:</span> {medication.dosage}</p>
                    )}
                    
                    {medication.frequency && (
                      <p><span className="font-medium">Frequency:</span> {medication.frequency}</p>
                    )}
                    
                    {medication.startDate && (
                      <p>
                        <span className="font-medium">Started:</span> {format(new Date(medication.startDate), 'MMM d, yyyy')}
                      </p>
                    )}
                    
                    {medication.endDate && (
                      <p>
                        <span className="font-medium">Until:</span> {format(new Date(medication.endDate), 'MMM d, yyyy')}
                      </p>
                    )}
                    
                    {medication.notes && (
                      <p><span className="font-medium">Notes:</span> {medication.notes}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditMedication(medication)}
                  >
                    <Edit size={16} />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Medication</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {medication.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteMedication(medication.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedMedication && (
        <EditMedicationDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          medication={selectedMedication}
        />
      )}
    </>
  );
};

export default MedicationList;
