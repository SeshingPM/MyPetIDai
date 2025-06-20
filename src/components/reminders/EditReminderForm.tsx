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
import { Reminder } from "@/contexts/reminders/types";

interface EditReminderFormProps {
  reminder: Reminder;
  onSubmit: (data: ReminderFormValues & { id: string }) => void;
  pets: { id: string; name: string }[];
  onCancel?: () => void;
}

const EditReminderForm: React.FC<EditReminderFormProps> = ({
  reminder,
  onSubmit,
  pets,
  onCancel,
}) => {
  const { preferences } = useUserPreferences();
  const defaultTime = preferences?.reminderTime
    ? preferences.reminderTime.substring(0, 5)
    : "09:00";

  // Determine initial petIds from either the pets array or the legacy petId
  const initialPetIds =
    reminder.pets?.map((pet) => pet.petId) ||
    (reminder.petId && reminder.petId !== "none" ? [reminder.petId] : []);

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: reminder.title,
      date: reminder.date,
      petId: reminder.petId || "none",
      petIds: initialPetIds,
      notes: reminder.notes || "",
      useCustomTime: !!reminder.customTime,
      customTime: reminder.customTime || defaultTime,
    },
  });

  const handleSubmit = (data: ReminderFormValues) => {
    // Include the reminder ID directly in the submission data
    console.log("Submitting edit for reminder ID:", reminder.id);
    onSubmit({
      ...data,
      id: reminder.id, // Pass the ID directly to ensure it's available
    });
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
          <Button type="submit">Update Reminder</Button>
        </div>
      </form>
    </Form>
  );
};

export default EditReminderForm;
