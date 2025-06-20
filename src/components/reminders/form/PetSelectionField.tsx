
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { ReminderFormValues } from "./reminderFormSchema";

interface PetSelectionFieldProps {
  form: UseFormReturn<ReminderFormValues>;
  pets: { id: string; name: string }[];
}

const PetSelectionField: React.FC<PetSelectionFieldProps> = ({ form, pets }) => {
  return (
    <FormField
      control={form.control}
      name="petId"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Pet</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="pet-none" />
                <FormLabel htmlFor="pet-none" className="font-normal cursor-pointer">
                  None
                </FormLabel>
              </div>
              
              {pets.length > 0 ? (
                pets.map((pet) => (
                  <div key={pet.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={pet.id} id={`pet-${pet.id}`} />
                    <FormLabel htmlFor={`pet-${pet.id}`} className="font-normal cursor-pointer">
                      {pet.name}
                    </FormLabel>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  No pets added yet.
                </div>
              )}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PetSelectionField;
