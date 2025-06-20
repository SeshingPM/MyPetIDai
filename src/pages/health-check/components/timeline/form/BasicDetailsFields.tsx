
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { MedicalEventFormValues } from '../schema/medicalEventSchema';
import DatePickerField from '../../common/DatePickerField';

interface BasicDetailsFieldsProps {
  form: UseFormReturn<MedicalEventFormValues>;
}

const BasicDetailsFields: React.FC<BasicDetailsFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="E.g. Annual check-up" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <DatePickerField
        form={form}
        name="eventDate"
        label="Date"
        placeholder="Pick a date"
      />
    </>
  );
};

export default BasicDetailsFields;
