
import React from 'react';
import { useHealth } from '@/contexts/health';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { MedicalEvent } from '@/utils/types';
import { MedicalEventFormValues } from './schema/medicalEventSchema';
import MedicalEventForm from './form/MedicalEventForm';

interface EditMedicalEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: MedicalEvent | null;
  petName?: string;
}

const EditMedicalEventDialog: React.FC<EditMedicalEventDialogProps> = ({
  open,
  onOpenChange,
  event,
  petName,
}) => {
  const { updateMedicalEvent, deleteMedicalEvent } = useHealth();

  const handleSubmit = async (data: MedicalEventFormValues) => {
    if (!event) return;

    const eventData = {
      title: data.title,
      eventDate: data.eventDate.toISOString(),
      eventType: data.eventType,
      description: data.description,
      provider: data.provider,
      cost: data.cost !== undefined && data.cost.trim() !== '' ? parseFloat(data.cost) : undefined,
    };

    const success = await updateMedicalEvent(event.id, eventData);
    if (success) {
      onOpenChange(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    
    const success = await deleteMedicalEvent(event.id);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Medical Event {petName && `for ${petName}`}</DialogTitle>
        </DialogHeader>

        <MedicalEventForm 
          event={event} 
          onSubmit={handleSubmit} 
          onDelete={handleDelete} 
          onClose={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditMedicalEventDialog;
