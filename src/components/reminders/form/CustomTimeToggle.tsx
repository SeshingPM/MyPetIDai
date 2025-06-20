
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ReminderFormValues } from "./reminderFormSchema";

interface CustomTimeToggleProps {
  form: UseFormReturn<ReminderFormValues>;
}

const CustomTimeToggle: React.FC<CustomTimeToggleProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="useCustomTime"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>Custom Notification Time</FormLabel>
            <p className="text-sm text-muted-foreground">
              Override your default notification time setting for this reminder
            </p>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default CustomTimeToggle;
