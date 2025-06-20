
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useHealth } from '@/contexts/health';
import { toast } from 'sonner';
import VaccinationForm from './VaccinationForm';
import { VaccinationFormValues } from './schema/vaccinationFormSchema';

interface VaccinationCreateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  petId: string;
  petName: string;
}

const VaccinationCreate: React.FC<VaccinationCreateProps> = ({
  open,
  onOpenChange,
  petId,
  petName,
}) => {
  const { addVaccination } = useHealth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: VaccinationFormValues = {
    name: '',
    dateAdministered: new Date(),
    administrator: '',
    batchNumber: '',
    notes: '',
  };
  
  const handleSubmit = async (values: VaccinationFormValues) => {
    setIsSubmitting(true);
    try {
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
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding vaccination:', error);
      toast.error('Failed to add vaccination');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Vaccination for {petName}</DialogTitle>
        </DialogHeader>
        
        <VaccinationForm 
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitLabel="Add Vaccination"
        />
      </DialogContent>
    </Dialog>
  );
};

export default VaccinationCreate;
