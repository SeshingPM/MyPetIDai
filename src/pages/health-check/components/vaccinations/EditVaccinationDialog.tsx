
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useHealth } from '@/contexts/health';
import { toast } from 'sonner';
import { Vaccination } from '@/utils/types';
import VaccinationForm from './VaccinationForm';
import { VaccinationFormValues } from './schema/vaccinationFormSchema';

interface EditVaccinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vaccination: Vaccination;
  petName: string;
}

const EditVaccinationDialog: React.FC<EditVaccinationDialogProps> = ({
  open,
  onOpenChange,
  vaccination,
  petName,
}) => {
  const { updateVaccination } = useHealth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create default values from vaccination data
  const defaultValues: VaccinationFormValues = {
    name: vaccination.name,
    dateAdministered: vaccination.dateAdministered ? new Date(vaccination.dateAdministered) : new Date(),
    expirationDate: vaccination.expirationDate ? new Date(vaccination.expirationDate) : undefined,
    administrator: vaccination.administrator || '',
    batchNumber: vaccination.batchNumber || '',
    notes: vaccination.notes || '',
  };
  
  const handleSubmit = async (values: VaccinationFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const success = await updateVaccination(vaccination.id, {
        ...vaccination,
        name: values.name,
        dateAdministered: values.dateAdministered.toISOString(),
        expirationDate: values.expirationDate ? values.expirationDate.toISOString() : undefined,
        administrator: values.administrator,
        batchNumber: values.batchNumber,
        notes: values.notes,
      });
      
      if (success) {
        toast.success(`Vaccination updated for ${petName}`);
        onOpenChange(false);
      } else {
        toast.error('Failed to update vaccination');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error updating vaccination:', error);
      toast.error('Failed to update vaccination');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  // Generate a unique key for the form to force a fresh render on each open
  const formKey = open ? `vaccination-form-${vaccination.id}-${Date.now()}` : '';

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Only allow the dialog to close if we're not submitting
      if (!isSubmitting) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Vaccination for {petName}</DialogTitle>
          <DialogDescription>
            Make changes to the vaccination record below.
          </DialogDescription>
        </DialogHeader>
        
        {open && (
          <VaccinationForm 
            key={formKey}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            submitLabel="Update Vaccination"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditVaccinationDialog;
