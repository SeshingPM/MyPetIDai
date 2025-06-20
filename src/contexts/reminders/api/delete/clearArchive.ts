
import { supabase } from '@/integrations/supabase/client';

export const clearArchiveInSupabase = async (userId: string) => {
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('user_id', userId)
    .eq('archived', true);
    
  if (error) throw error;
  return true;
};
