
import { supabase } from '@/integrations/supabase/client';

export const completeReminderInSupabase = async (reminderId: string) => {
  const { error } = await supabase
    .from('reminders')
    .update({ archived: true })
    .eq('id', reminderId);
    
  if (error) throw error;
  return true;
};
