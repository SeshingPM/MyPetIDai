
import { supabase } from "@/integrations/supabase/client";
import { Reminder } from "../../types";

export const updateReminderInSupabase = async (
  reminderId: string,
  data: {
    title?: string;
    date?: Date;
    petId?: string | null;
    petIds?: string[];
    notes?: string;
    customTime?: string | null;
  },
  petMap?: Record<string, string>
) => {
  try {
    const petIdsToUse =
      data.petIds && data.petIds.length > 0
        ? data.petIds
        : data.petId && data.petId !== "none"
          ? [data.petId]
          : [];

    const singlePetId = petIdsToUse.length === 1 ? petIdsToUse[0] : null;
    const singlePetName = singlePetId && petMap ? petMap[singlePetId] : null;

    const { error: updateError } = await supabase
      .from("reminders")
      .update({
        title: data.title,
        date: data.date?.toISOString(),
        pet_id: singlePetId,
        ...(singlePetName ? { pet_name: singlePetName } : {}),
        notes: data.notes,
        custom_time: data.customTime,
      })
      .eq("id", reminderId);

    if (updateError) throw updateError;

    if (data.petIds !== undefined || data.petId !== undefined) {
      const { error: deleteError } = await supabase
        .from("reminder_pets")
        .delete()
        .eq("reminder_id", reminderId);

      if (deleteError) throw deleteError;

      if (petIdsToUse.length > 0) {
        const petAssociations = petIdsToUse.map((petId) => ({
          reminder_id: reminderId,
          pet_id: petId,
        }));

        const { error: insertError } = await supabase
          .from("reminder_pets")
          .insert(petAssociations);

        if (insertError) throw insertError;
      }
    }

    return true;
  } catch (error) {
    throw error;
  }
};
