
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { MedicalEvent } from '@/utils/types';
import { medicalEventSchema, MedicalEventFormValues } from '../schema/medicalEventSchema';
import BasicDetailsFields from './BasicDetailsFields';
import EventTypeField from './EventTypeField';
import DescriptionField from './DescriptionField';
import AdditionalDetailsFields from './AdditionalDetailsFields';
import DialogFooterActions from './DialogFooterActions';

interface MedicalEventFormProps {
  event: MedicalEvent | null;
  onSubmit: (data: MedicalEventFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

const MedicalEventForm: React.FC<MedicalEventFormProps> = ({
  event,
  onSubmit,
  onDelete,
  onClose
}) => {
  const form = useForm<MedicalEventFormValues>({
    resolver: zodResolver(medicalEventSchema),
    defaultValues: {
      title: '',
      eventDate: new Date(),
      eventType: 'checkup',
      description: '',
      provider: '',
      cost: '',
    },
  });

  // Update form values when event changes
  React.useEffect(() => {
    if (event) {
      form.reset({
        title: event.title,
        eventDate: new Date(event.eventDate),
        eventType: event.eventType,
        description: event.description || '',
        provider: event.provider || '',
        cost: event.cost !== undefined ? String(event.cost) : '',
      });
    }
  }, [event, form]);

  const handleSubmit = async (data: MedicalEventFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BasicDetailsFields form={form} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EventTypeField form={form} />
        </div>

        <DescriptionField form={form} />
        
        <AdditionalDetailsFields form={form} />

        <DialogFooterActions 
          onClose={onClose} 
          onDelete={onDelete} 
        />
      </form>
    </Form>
  );
};

export default MedicalEventForm;
