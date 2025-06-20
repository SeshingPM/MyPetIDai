
import { z } from 'zod';

export const healthRecordFormSchema = z.object({
  weight: z.string().optional(),
  notes: z.string().optional(),
  recordDate: z.date({
    required_error: "Record date is required",
  }),
});

export type HealthRecordFormValues = z.infer<typeof healthRecordFormSchema>;
