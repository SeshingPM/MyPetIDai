
import { supabase } from '@/integrations/supabase/client';

export const rescheduleReminderInSupabase = async (reminderId: string, newDate: Date) => {
  const { error } = await supabase
    .from('reminders')
    .update({ date: newDate.toISOString() })
    .eq('id', reminderId);
    
  if (error) throw error;
  return true;
};
