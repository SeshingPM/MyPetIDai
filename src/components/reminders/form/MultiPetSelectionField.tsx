import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { ReminderFormValues } from "./reminderFormSchema";

interface MultiPetSelectionFieldProps {
  form: UseFormReturn<ReminderFormValues>;
  pets: { id: string; name: string }[];
}

const MultiPetSelectionField: React.FC<MultiPetSelectionFieldProps> = ({
  form,
  pets,
}) => {
  const selectedPetIds = form.watch("petIds") || [];

  const togglePet = (petId: string) => {
    const currentPets = [...selectedPetIds];
    const index = currentPets.indexOf(petId);

    if (index > -1) {
      currentPets.splice(index, 1);
    } else {
      currentPets.push(petId);
    }

    form.setValue("petIds", currentPets, { shouldValidate: true });

    // Also update the legacy petId field for backward compatibility
    if (currentPets.length === 1) {
      form.setValue("petId", currentPets[0], { shouldValidate: true });
    } else if (currentPets.length === 0) {
      form.setValue("petId", "none", { shouldValidate: true });
    }
  };

  React.useEffect(() => {
    // Initialize petIds with the single petId value for backward compatibility
    const singlePetId = form.getValues("petId");
    if (singlePetId && singlePetId !== "none" && selectedPetIds.length === 0) {
      form.setValue("petIds", [singlePetId], { shouldValidate: false });
    }
  }, []);

  return (
    <FormField
      control={form.control}
      name="petIds"
      render={() => (
        <FormItem className="space-y-3">
          <FormLabel>Pets</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {pets.length > 0 ? (
                pets.map((pet) => (
                  <div key={pet.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`pet-${pet.id}`}
                      checked={selectedPetIds.includes(pet.id)}
                      onCheckedChange={() => togglePet(pet.id)}
                    />
                    <label
                      htmlFor={`pet-${pet.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {pet.name}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No pets added yet.</div>
              )}

              {/* Option for "None" */}
              <div className="flex items-center space-x-2 mt-2 pt-2 border-t">
                <Checkbox
                  id="pet-none"
                  checked={selectedPetIds.length === 0}
                  onCheckedChange={() => {
                    form.setValue("petIds", [], { shouldValidate: true });
                    form.setValue("petId", "none", { shouldValidate: true });
                  }}
                />
                <label
                  htmlFor="pet-none"
                  className="text-sm font-normal cursor-pointer"
                >
                  General (No specific pet)
                </label>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MultiPetSelectionField;
