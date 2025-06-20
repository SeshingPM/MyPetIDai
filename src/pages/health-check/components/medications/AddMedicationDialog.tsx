
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MedicationForm from './MedicationForm';
import { useHealth } from '@/contexts/health';
import { toast } from 'sonner';
import { MedicationFormValues } from './schema/medicationFormSchema';

interface AddMedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  petId: string;
  petName: string;
  healthRecordId?: string;
}

const AddMedicationDialog: React.FC<AddMedicationDialogProps> = ({
  open,
  onOpenChange,
  petId,
  petName,
  healthRecordId
}) => {
  const { addMedication } = useHealth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: MedicationFormValues = {
    name: '',
    dosage: '',
    frequency: '',
    notes: '',
  };
  
  const handleSubmit = async (values: MedicationFormValues) => {
    setIsSubmitting(true);
    try {
      const medicationId = await addMedication({
        petId,
        name: values.name,
        dosage: values.dosage || undefined,
        frequency: values.frequency || undefined,
        startDate: values.startDate ? values.startDate.toISOString() : undefined,
        endDate: values.endDate ? values.endDate.toISOString() : undefined,
        notes: values.notes || undefined,
        healthRecordId
      });
      
      if (medicationId) {
        toast.success(`Medication added for ${petName}`);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error adding medication:', error);
      toast.error('Failed to add medication. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Medication for {petName}</DialogTitle>
        </DialogHeader>
        
        <MedicationForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          submitLabel="Add Medication"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicationDialog;
