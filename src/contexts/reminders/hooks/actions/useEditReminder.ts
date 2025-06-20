import { useState } from "react";
import { Reminder, Pet, ReminderPet } from "../../types";
import { toast } from "sonner";
import {
  updateReminderInSupabase,
  saveRemindersToLocalStorage,
} from "../../api";

interface UseEditReminderProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  pets: Pet[];
  userId: string | undefined;
}

export const useEditReminder = ({
  reminders,
  setReminders,
  setError,
  pets,
  userId,
}: UseEditReminderProps) => {
  const [selectedReminderId, setSelectedReminderId] = useState<string | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const selectedReminder = reminders.find(
    (reminder) => reminder.id === selectedReminderId
  );

  const handleOpenEditDialog = (id: string) => {
    console.log("DEBUG - handleOpenEditDialog called with id:", id);
    setSelectedReminderId(id);
    console.log(
      "DEBUG - After setSelectedReminderId, current state:",
      selectedReminderId
    );
    // Note: This will show the previous state due to React's state update mechanism
    setIsEditDialogOpen(true);
  };

  const handleEditReminder = async (data: {
    title: string;
    date: Date;
    petId?: string; // For backward compatibility
    petIds?: string[]; // Added for multiple pets
    notes?: string;
    useCustomTime?: boolean;
    customTime?: string;
    reminderId?: string; // Accept reminderId directly from form data
    id?: string; // Also accept id directly from form data
  }) => {
    // Get the reminder ID either from the form data or the local state
    const reminderId = data.reminderId || data.id || selectedReminderId;

    console.log("DEBUG - Edit Reminder - User ID:", userId);
    console.log("DEBUG - Edit Reminder - Reminder ID to use:", reminderId);
    console.log(
      "DEBUG - Edit Reminder - Selected Reminder ID (state):",
      selectedReminderId
    );

    if (!userId) {
      console.error("DEBUG - Edit Reminder Auth Error - userId:", userId);
      toast.error("You must be logged in to edit a reminder");
      return;
    }

    if (!reminderId) {
      console.error("DEBUG - Edit Reminder Error - No reminder ID found");
      toast.error("No reminder selected for editing");
      return;
    }

    try {
      setError(null);

      // Create a map of petId -> petName for easy lookup
      const petMap: Record<string, string> = {};
      pets.forEach((pet) => {
        petMap[pet.id] = pet.name;
      });

      // Determine which pet IDs to use (prefer petIds, fall back to petId)
      const petIdsToUse =
        data.petIds && data.petIds.length > 0
          ? data.petIds
          : data.petId && data.petId !== "none"
            ? [data.petId]
            : [];

      // Create ReminderPet objects for all selected pets
      const reminderPets: ReminderPet[] = petIdsToUse.map((petId) => ({
        petId,
        petName: petMap[petId] || "Unknown Pet",
      }));

      // For backward compatibility, support single pet
      let primaryPetId = "";
      let primaryPetName = "";

      if (petIdsToUse.length === 1) {
        primaryPetId = petIdsToUse[0];
        primaryPetName = petMap[primaryPetId] || "";
      } else if (petIdsToUse.length === 0) {
        primaryPetId = "";
        primaryPetName = "General";
      } else {
        // Multiple pets, use the first one as primary
        primaryPetId = petIdsToUse[0];
        primaryPetName = `${petMap[primaryPetId]} and ${petIdsToUse.length - 1} more`;
      }

      // Extract custom time if needed
      const customTime =
        data.useCustomTime && data.customTime ? data.customTime : null;

      // Update in database using the reminder ID from form data or state
      await updateReminderInSupabase(
        reminderId,
        {
          title: data.title,
          date: data.date,
          petId: primaryPetId !== "" ? primaryPetId : null,
          petIds: petIdsToUse,
          notes: data.notes,
          customTime,
        },
        petMap
      );

      // Update in local state
      const updatedReminders = reminders.map((reminder) =>
        reminder.id === reminderId
          ? {
              ...reminder,
              title: data.title,
              date: data.date,
              petId: primaryPetId || "",
              petName: primaryPetName,
              pets: reminderPets,
              notes: data.notes || "",
              customTime,
            }
          : reminder
      );

      setReminders(updatedReminders);

      // Save to localStorage as backup
      saveRemindersToLocalStorage(updatedReminders);

      setIsEditDialogOpen(false);
      setSelectedReminderId(null);

      toast.success("Reminder updated successfully!");
    } catch (error) {
      console.error("Error updating reminder:", error);
      setError("Failed to update reminder. Please try again.");
      toast.error("Failed to update reminder. Please try again.");

      // Fallback to localStorage only
      try {
        // Create a map of petId -> petName for easy lookup
        const petMap: Record<string, string> = {};
        pets.forEach((pet) => {
          petMap[pet.id] = pet.name;
        });

        // Determine which pet IDs to use (prefer petIds, fall back to petId)
        const petIdsToUse =
          data.petIds && data.petIds.length > 0
            ? data.petIds
            : data.petId && data.petId !== "none"
              ? [data.petId]
              : [];

        // Create ReminderPet objects for all selected pets
        const reminderPets: ReminderPet[] = petIdsToUse.map((petId) => ({
          petId,
          petName: petMap[petId] || "Unknown Pet",
        }));

        // For backward compatibility, support single pet
        let primaryPetId = "";
        let primaryPetName = "";

        if (petIdsToUse.length === 1) {
          primaryPetId = petIdsToUse[0];
          primaryPetName = petMap[primaryPetId] || "";
        } else if (petIdsToUse.length === 0) {
          primaryPetId = "";
          primaryPetName = "General";
        } else {
          // Multiple pets, use the first one as primary
          primaryPetId = petIdsToUse[0];
          primaryPetName = `${petMap[primaryPetId]} and ${petIdsToUse.length - 1} more`;
        }

        // Extract custom time if needed
        const customTime =
          data.useCustomTime && data.customTime ? data.customTime : null;

        const updatedReminders = reminders.map((reminder) =>
          reminder.id === selectedReminderId
            ? {
                ...reminder,
                title: data.title,
                date: data.date,
                petId: primaryPetId || "",
                petName: primaryPetName,
                pets: reminderPets,
                notes: data.notes || "",
                customTime,
              }
            : reminder
        );

        setReminders(updatedReminders);
        saveRemindersToLocalStorage(updatedReminders);

        setIsEditDialogOpen(false);
        setSelectedReminderId(null);

        toast.success("Reminder updated in local storage only!");
      } catch (localError) {
        console.error("Error updating reminder in localStorage:", localError);
      }
    }
  };

  return {
    selectedReminderId,
    selectedReminder,
    isEditDialogOpen,
    setSelectedReminderId,
    setIsEditDialogOpen,
    handleOpenEditDialog,
    handleEditReminder,
  };
};
