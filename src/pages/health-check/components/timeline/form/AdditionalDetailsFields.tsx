
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { MedicalEventFormValues } from '../schema/medicalEventSchema';

interface AdditionalDetailsFieldsProps {
  form: UseFormReturn<MedicalEventFormValues>;
}

const AdditionalDetailsFields: React.FC<AdditionalDetailsFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="provider"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Provider/Clinic</FormLabel>
            <FormControl>
              <Input placeholder="E.g. City Vet Hospital" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cost (optional)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="$0.00" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AdditionalDetailsFields;
