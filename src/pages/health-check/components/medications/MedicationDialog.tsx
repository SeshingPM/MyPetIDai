
import React, { useState } from 'react';
import { Medication } from '@/utils/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useHealth } from '@/contexts/health';
import { toast } from 'sonner';
import MedicationForm from './MedicationForm';
import { MedicationFormValues } from './schema/medicationFormSchema';

interface MedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  petId: string;
  petName: string;
  mode: 'add' | 'edit';
  medication?: Medication;
}

const MedicationDialog: React.FC<MedicationDialogProps> = ({
  open,
  onOpenChange,
  petId,
  petName,
  mode,
  medication
}) => {
  const { addMedication, updateMedication } = useHealth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: MedicationFormValues = mode === 'add' 
    ? {
        name: '',
        dosage: '',
        frequency: '',
        notes: '',
      }
    : {
        name: medication?.name || '',
        dosage: medication?.dosage || '',
        frequency: medication?.frequency || '',
        startDate: medication?.startDate ? new Date(medication.startDate) : undefined,
        endDate: medication?.endDate ? new Date(medication.endDate) : undefined,
        notes: medication?.notes || '',
      };
  
  const handleSubmit = async (values: MedicationFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (mode === 'add') {
        await addMedication({
          petId,
          name: values.name,
          dosage: values.dosage,
          frequency: values.frequency,
          startDate: values.startDate ? values.startDate.toISOString() : undefined,
          endDate: values.endDate ? values.endDate.toISOString() : undefined,
          notes: values.notes,
        });
        
        toast.success(`Medication added for ${petName}`);
      } else if (medication) {
        const success = await updateMedication(medication.id, {
          ...medication,
          name: values.name,
          dosage: values.dosage,
          frequency: values.frequency,
          startDate: values.startDate ? values.startDate.toISOString() : undefined,
          endDate: values.endDate ? values.endDate.toISOString() : undefined,
          notes: values.notes,
        });
        
        if (success) {
          toast.success(`Medication updated for ${petName}`);
        } else {
          throw new Error('Failed to update medication');
        }
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} medication:`, error);
      toast.error(`Failed to ${mode === 'add' ? 'add' : 'update'} medication`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  // Create a unique key for the form to ensure it's properly reset when opened
  const formKey = open ? `medication-form-${mode}-${medication?.id || 'new'}-${Date.now()}` : '';

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!isSubmitting) {
          onOpenChange(newOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add Medication' : 'Edit Medication'} for {petName}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Add a new medication record for your pet.' 
              : 'Update this medication record with the latest information.'}
          </DialogDescription>
        </DialogHeader>
        
        {open && (
          <MedicationForm 
            key={formKey}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            submitLabel={mode === 'add' ? 'Add Medication' : 'Update Medication'}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MedicationDialog;
