import { useState } from "react";
import { Reminder, Pet, ReminderPet } from "../../types";
import { toast } from "sonner";
import { addReminderToSupabase, saveRemindersToLocalStorage } from "../../api";

interface UseAddReminderProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  pets: Pet[];
  userId: string | undefined;
}

interface ReminderFormData extends Omit<Reminder, "id" | "petName" | "pets"> {
  useCustomTime?: boolean;
  customTime?: string;
  petId?: string; // For backward compatibility
  petIds?: string[]; // Added for multiple pets
}

export const useAddReminder = ({
  reminders,
  setReminders,
  setError,
  pets,
  userId,
}: UseAddReminderProps) => {
  const [isAddReminderDialogOpen, setIsAddReminderDialogOpen] = useState(false);

  // Helper function to prepare a reminder with proper pet names
  const prepareReminderData = (data: ReminderFormData) => {
    // Create a map of petId -> petName for easy lookup
    const petNameMap: Record<string, string> = {};
    pets.forEach((pet) => {
      petNameMap[pet.id] = pet.name;
    });

    // Determine which pet IDs to use (prefer petIds, fall back to petId)
    const petIdsToUse =
      data.petIds && data.petIds.length > 0
        ? data.petIds
        : data.petId && data.petId !== "none"
          ? [data.petId]
          : [];

    // For backward compatibility, support single pet
    let primaryPetId = "";
    let primaryPetName = "";

    if (petIdsToUse.length === 1) {
      primaryPetId = petIdsToUse[0];
      primaryPetName = petNameMap[primaryPetId] || "";
    } else if (petIdsToUse.length === 0) {
      primaryPetId = "";
      primaryPetName = "General";
    } else {
      // Multiple pets, use the first one as primary
      primaryPetId = petIdsToUse[0];
      primaryPetName = `${petNameMap[primaryPetId]} and ${petIdsToUse.length - 1} more`;
    }

    // Create ReminderPet objects for all selected pets
    const reminderPets: ReminderPet[] = petIdsToUse.map((petId) => ({
      petId,
      petName: petNameMap[petId] || "Unknown Pet",
    }));

    // Extract custom time if needed
    const customTime =
      data.useCustomTime && data.customTime ? data.customTime : null;

    return {
      title: data.title,
      date: data.date,
      petId: primaryPetId,
      petName: primaryPetName,
      petIds: petIdsToUse,
      pets: reminderPets,
      notes: data.notes,
      customTime,
    };
  };

  // Handle adding a reminder to Supabase
  const addReminderToDatabase = async (
    reminderData: any,
    petName: string,
    petMap: Record<string, string>
  ) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    return await addReminderToSupabase(userId, reminderData, petName, petMap);
  };

  // Fallback to local storage when database operation fails
  const saveReminderToLocalStorage = (
    data: ReminderFormData,
    reminderData: ReturnType<typeof prepareReminderData>
  ) => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      title: data.title,
      date: data.date,
      petId: reminderData.petId,
      petName: reminderData.petName,
      pets: reminderData.pets,
      notes: data.notes,
      customTime: reminderData.customTime,
      archived: false,
    };

    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    saveRemindersToLocalStorage(updatedReminders);

    return newReminder;
  };

  const handleAddReminder = async (data: ReminderFormData) => {
    if (!userId) {
      toast.error("You must be logged in to add a reminder");
      return;
    }

    try {
      setError(null);

      // Prepare the reminder data
      const reminderData = prepareReminderData(data);

      // Create a pet ID -> name map for database operations
      const petMap: Record<string, string> = {};
      pets.forEach((pet) => {
        petMap[pet.id] = pet.name;
      });

      // Try to save to database
      const mappedReminder = await addReminderToDatabase(
        {
          title: reminderData.title,
          date: reminderData.date,
          petId: reminderData.petId,
          petIds: reminderData.petIds,
          notes: reminderData.notes,
          customTime: reminderData.customTime,
        },
        reminderData.petName,
        petMap
      );

      // Update UI state
      const updatedReminders = [...reminders, mappedReminder];
      setReminders(updatedReminders);

      // Save to localStorage as backup
      saveRemindersToLocalStorage(updatedReminders);

      toast.success(`Reminder "${data.title}" added successfully!`);

      // Note: We're no longer closing the dialog here
      // It's the responsibility of the component using this hook
      // to close the dialog after the handleAddReminder promise resolves
    } catch (error) {
      console.error("Error adding reminder:", error);
      setError("Failed to add reminder. Please try again.");
      toast.error("Failed to add reminder. Please try again.");

      // Fallback to localStorage only
      try {
        const reminderData = prepareReminderData(data);

        const savedReminder = saveReminderToLocalStorage(data, reminderData);

        if (savedReminder) {
          toast.success(
            `Reminder "${data.title}" added to local storage only!`
          );
          // Note: We're no longer closing the dialog here
          // It's the responsibility of the component using this hook
        }
      } catch (localError) {
        console.error("Error adding reminder to localStorage:", localError);
        toast.error("Could not save reminder even locally. Please try again.");
      }
    }
  };

  return {
    isAddReminderDialogOpen,
    setIsAddReminderDialogOpen,
    handleAddReminder,
  };
};
