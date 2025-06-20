
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { VaccinationFormValues } from '../schema/vaccinationFormSchema';

interface TextareaFieldProps {
  form: UseFormReturn<VaccinationFormValues>;
  name: 'notes';
  label: string;
  placeholder: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({ form, name, label, placeholder }) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextareaField;
