
import { z } from "zod";

export const vaccinationFormSchema = z.object({
  name: z.string().min(1, "Vaccination name is required"),
  dateAdministered: z.date({
    required_error: "Date administered is required",
  }),
  expirationDate: z.date().optional(),
  administrator: z.string().optional(),
  batchNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type VaccinationFormValues = z.infer<typeof vaccinationFormSchema>;
