import { supabase } from "@/integrations/supabase/client";
import { Reminder, ReminderPet } from "../../types";

export const fetchRemindersFromSupabase = async (userId: string) => {
  // Fetch all reminders for the user
  const { data: remindersData, error: remindersError } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true });

  if (remindersError) throw remindersError;

  if (!remindersData || remindersData.length === 0) {
    return null;
  }

  // Create a map of reminder IDs
  const reminderIds = remindersData.map((reminder) => reminder.id);

  // Fetch all reminder_pets relationships for these reminders
  const { data: reminderPetsData, error: reminderPetsError } = await supabase
    .from("reminder_pets")
    .select("reminder_id, pet_id, pets(id, name)")
    .in("reminder_id", reminderIds);

  if (reminderPetsError) throw reminderPetsError;

  // Group the pet relationships by reminder ID
  const reminderPetsMap: Record<string, ReminderPet[]> = {};

  if (reminderPetsData && reminderPetsData.length > 0) {
    reminderPetsData.forEach((relation) => {
      if (!reminderPetsMap[relation.reminder_id]) {
        reminderPetsMap[relation.reminder_id] = [];
      }

      reminderPetsMap[relation.reminder_id].push({
        petId: relation.pet_id,
        petName: relation.pets?.name || "Unknown Pet",
      });
    });
  }

  // Map database format to our app's Reminder interface
  return remindersData.map((dbReminder) => ({
    id: dbReminder.id,
    title: dbReminder.title,
    date: new Date(dbReminder.date),
    petId: dbReminder.pet_id,
    petName: dbReminder.pet_name,
    pets: reminderPetsMap[dbReminder.id] || undefined,
    notes: dbReminder.notes || "",
    archived: dbReminder.archived || false,
    customTime: dbReminder.custom_time || undefined,
    notificationSent: dbReminder.notification_sent || false,
  }));
};
