import { z } from "zod";

export const reminderSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  date: z.date({
    required_error: "A date is required",
  }),
  petId: z.string().optional().default("none"),
  petIds: z.array(z.string()).default([]),
  notes: z.string().optional(),
  customTime: z.string().optional(),
  useCustomTime: z.boolean().default(false),
});

export type ReminderFormValues = z.infer<typeof reminderSchema>;
