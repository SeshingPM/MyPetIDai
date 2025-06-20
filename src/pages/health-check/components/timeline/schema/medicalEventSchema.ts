
import * as z from 'zod';

export const medicalEventSchema = z.object({
  title: z.string().min(2, { message: 'Title is required' }),
  eventDate: z.date({ required_error: 'Date is required' }),
  eventType: z.string({ required_error: 'Event type is required' }),
  description: z.string().optional(),
  provider: z.string().optional(),
  cost: z.string().optional()
    .transform(val => val && val.trim() !== '' ? parseFloat(val) : undefined),
});

// Explicitly define MedicalEventFormValues with cost as string
export interface MedicalEventFormValues {
  title: string;
  eventDate: Date;
  eventType: string;
  description?: string;
  provider?: string;
  cost?: string; // This is a string in the form
}

export const EVENT_TYPE_OPTIONS = [
  { value: 'checkup', label: 'Check-up' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'procedure', label: 'Procedure/Surgery' },
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'medication', label: 'Medication' },
  { value: 'other', label: 'Other' },
];
