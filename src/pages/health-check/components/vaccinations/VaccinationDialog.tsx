
import React, { useState } from 'react';
import { Vaccination } from '@/utils/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useHealth } from '@/contexts/health';
import { toast } from 'sonner';
import VaccinationForm from './VaccinationForm';
import { VaccinationFormValues } from './schema/vaccinationFormSchema';

interface VaccinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  petId: string;
  petName: string;
  mode: 'add' | 'edit';
  vaccination?: Vaccination;
}

const VaccinationDialog: React.FC<VaccinationDialogProps> = ({
  open,
  onOpenChange,
  petId,
  petName,
  mode,
  vaccination
}) => {
  const { addVaccination, updateVaccination } = useHealth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create default values based on mode
  const defaultValues: VaccinationFormValues = mode === 'add' 
    ? {
        name: '',
        dateAdministered: new Date(),
        administrator: '',
        batchNumber: '',
        notes: '',
      }
    : {
        name: vaccination?.name || '',
        dateAdministered: vaccination?.dateAdministered ? new Date(vaccination.dateAdministered) : new Date(),
        expirationDate: vaccination?.expirationDate ? new Date(vaccination.expirationDate) : undefined,
        administrator: vaccination?.administrator || '',
        batchNumber: vaccination?.batchNumber || '',
        notes: vaccination?.notes || '',
      };
  
  const handleSubmit = async (values: VaccinationFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (mode === 'add') {
        // Add new vaccination
        await addVaccination({
          petId,
          name: values.name,
          dateAdministered: values.dateAdministered.toISOString(),
          expirationDate: values.expirationDate ? values.expirationDate.toISOString() : undefined,
          administrator: values.administrator,
          batchNumber: values.batchNumber,
          notes: values.notes,
        });
        
        toast.success(`Vaccination added for ${petName}`);
      } else if (vaccination) {
        // Update existing vaccination
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
        } else {
          throw new Error('Failed to update vaccination');
        }
      }
      
      // Close dialog on success
      onOpenChange(false);
    } catch (error) {
      console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} vaccination:`, error);
      toast.error(`Failed to ${mode === 'add' ? 'add' : 'update'} vaccination`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  // Using a unique key to force remounting the form when dialog opens
  const formKey = open ? `vaccination-form-${mode}-${vaccination?.id || 'new'}-${Date.now()}` : '';

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
            {mode === 'add' ? 'Add Vaccination' : 'Edit Vaccination'} for {petName}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Add a new vaccination record for your pet.' 
              : 'Update this vaccination record with the latest information.'}
          </DialogDescription>
        </DialogHeader>
        
        {open && (
          <VaccinationForm 
            key={formKey}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            submitLabel={mode === 'add' ? 'Add Vaccination' : 'Update Vaccination'}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VaccinationDialog;
