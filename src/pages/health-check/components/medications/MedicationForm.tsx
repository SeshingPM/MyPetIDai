
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { medicationFormSchema, MedicationFormValues } from './schema/medicationFormSchema';
import DatePickerField from '../common/DatePickerField';

interface MedicationFormProps {
  defaultValues: MedicationFormValues;
  onSubmit: (values: MedicationFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

const MedicationForm: React.FC<MedicationFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}) => {
  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues,
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medication Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Amoxicillin, Heartworm Prevention" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 10mg, 1 tablet" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Once daily, Twice weekly" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DatePickerField
            form={form}
            name="startDate"
            label="Start Date"
            placeholder="Select start date"
            optional={true}
          />

          <DatePickerField
            form={form}
            name="endDate"
            label="End Date"
            placeholder="Select end date"
            optional={true}
            disabled={(date) => {
              // Disable dates before start date if start date is selected
              const startDate = form.getValues('startDate');
              if (startDate) {
                return date < startDate;
              }
              return false;
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional information about this medication" 
                  className="resize-none h-20" 
                  {...field} 
                  value={field.value || ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MedicationForm;
