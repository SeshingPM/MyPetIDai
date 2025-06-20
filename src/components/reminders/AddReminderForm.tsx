import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useUserPreferences } from "@/contexts/userPreferences";
import { reminderSchema, ReminderFormValues } from "./form/reminderFormSchema";
import BasicFields from "./form/BasicFields";
import DatePickerField from "./form/DatePickerField";
import CustomTimeToggle from "./form/CustomTimeToggle";
import TimeSelectionField from "./form/TimeSelectionField";
import MultiPetSelectionField from "./form/MultiPetSelectionField";

interface AddReminderFormProps {
  onSubmit: (data: ReminderFormValues) => void;
  pets: { id: string; name: string }[];
  onCancel?: () => void;
}

const AddReminderForm: React.FC<AddReminderFormProps> = ({
  onSubmit,
  pets,
  onCancel,
}) => {
  const { preferences } = useUserPreferences();

  const defaultTime = preferences?.reminderTime
    ? preferences.reminderTime.substring(0, 5)
    : "09:00";

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      petId: "none",
      petIds: [],
      notes: "",
      useCustomTime: false,
      customTime: defaultTime,
    },
  });

  const handleSubmit = (data: ReminderFormValues) => {
    onSubmit(data);
    form.reset();
  };

  const useCustomTime = form.watch("useCustomTime");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicFields form={form} />
        <DatePickerField form={form} />
        <CustomTimeToggle form={form} />

        {useCustomTime && <TimeSelectionField form={form} />}

        <MultiPetSelectionField form={form} pets={pets} />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Add Reminder</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddReminderForm;
