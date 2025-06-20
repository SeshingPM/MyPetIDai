
import { MedicalEvent, NewMedicalEventData } from '@/utils/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface UseMedicalEventsProps {
  user: User | null;
  fetchHealthData: () => Promise<void>;
}

export const useMedicalEvents = ({ user, fetchHealthData }: UseMedicalEventsProps) => {
  // Add a new medical event
  const addMedicalEvent = async (event: NewMedicalEventData): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data: newEvent, error } = await supabase
        .from('medical_events')
        .insert({
          pet_id: event.petId,
          user_id: user.id,
          event_date: event.eventDate,
          event_type: event.eventType,
          title: event.title,
          description: event.description,
          provider: event.provider,
          cost: event.cost,
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh data
      await fetchHealthData();
      toast.success("Medical event added successfully");
      return newEvent.id;
    } catch (error) {
      console.error('Error adding medical event:', error);
      toast.error('Failed to add medical event. Please try again.');
      return null;
    }
  };

  // Update an existing medical event
  const updateMedicalEvent = async (id: string, event: Partial<MedicalEvent>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('medical_events')
        .update({
          event_date: event.eventDate,
          event_type: event.eventType,
          title: event.title,
          description: event.description,
          provider: event.provider,
          cost: event.cost,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh data
      await fetchHealthData();
      toast.success("Medical event updated successfully");
      return true;
    } catch (error) {
      console.error('Error updating medical event:', error);
      toast.error('Failed to update medical event. Please try again.');
      return false;
    }
  };

  // Delete a medical event
  const deleteMedicalEvent = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('medical_events')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh data
      await fetchHealthData();
      toast.success("Medical event deleted successfully");
      return true;
    } catch (error) {
      console.error('Error deleting medical event:', error);
      toast.error('Failed to delete medical event. Please try again.');
      return false;
    }
  };

  return {
    addMedicalEvent,
    updateMedicalEvent,
    deleteMedicalEvent
  };
};
