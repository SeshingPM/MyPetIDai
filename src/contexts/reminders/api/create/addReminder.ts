
import { supabase } from "@/integrations/supabase/client";
import { Reminder, ReminderPet } from "../../types";

interface AddReminderData extends Omit<Reminder, "id" | "petName" | "pets"> {
  customTime?: string | null;
  petId?: string; // Kept for backward compatibility
  petIds?: string[]; // Added for multiple pets
}

export const addReminderToSupabase = async (
  userId: string,
  data: AddReminderData,
  petName: string,
  petMap?: Record<string, string> // Map of pet IDs to pet names
) => {
  try {
    // For backward compatibility, if petIds is not provided but petId is, use that
    const petIdsToUse =
      data.petIds && data.petIds.length > 0
        ? data.petIds
        : data.petId && data.petId !== "none"
          ? [data.petId]
          : [];

    // Insert the reminder
    const { data: newReminder, error } = await supabase
      .from("reminders")
      .insert({
        user_id: userId,
        title: data.title,
        date: data.date.toISOString(),
        pet_id: petIdsToUse.length === 1 ? petIdsToUse[0] : null, // For backward compatibility
        pet_name:
          petIdsToUse.length === 1 && petMap
            ? petMap[petIdsToUse[0]]
            : petName || "General",
        notes: data.notes,
        custom_time: data.customTime || null,
        archived: false,
        notification_sent: false,
      })
      .select()
      .single();

    if (error) throw error;

    // If there are pet IDs, create the reminder_pets associations
    if (petIdsToUse.length > 0) {
      const petAssociations = petIdsToUse.map((petId) => ({
        reminder_id: newReminder.id,
        pet_id: petId,
      }));

      const { error: junctionError } = await supabase
        .from("reminder_pets")
        .insert(petAssociations);

      if (junctionError) throw junctionError;
    }

    // Map to our Reminder interface
    const pets: ReminderPet[] = petIdsToUse.map((petId) => ({
      petId,
      petName: petMap ? petMap[petId] : petName,
    }));

    return {
      id: newReminder.id,
      title: newReminder.title,
      date: new Date(newReminder.date),
      petId: newReminder.pet_id || "",
      petName: newReminder.pet_name || "",
      pets: pets.length > 0 ? pets : undefined,
      notes: newReminder.notes || "",
      customTime: newReminder.custom_time || undefined,
      archived: newReminder.archived || false,
      notificationSent: newReminder.notification_sent || false,
    };
  } catch (error) {
    throw error;
  }
};
