
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

/**
 * Service for fetching health-related data from the database
 */
export const healthDataService = {
  /**
   * Fetch health records for a specific user
   */
  async fetchHealthRecords(userId: string) {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('user_id', userId)
      .order('record_date', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },
  
  /**
   * Fetch medications for a specific user
   */
  async fetchMedications(userId: string) {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },
  
  /**
   * Fetch vaccinations for a specific user
   */
  async fetchVaccinations(userId: string) {
    const { data, error } = await supabase
      .from('vaccinations')
      .select('*')
      .eq('user_id', userId)
      .order('date_administered', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },
  
  /**
   * Fetch medical events for a specific user
   */
  async fetchMedicalEvents(userId: string) {
    const { data, error } = await supabase
      .from('medical_events')
      .select('*')
      .eq('user_id', userId)
      .order('event_date', { ascending: false });
      
    if (error) throw error;
    return data || [];
  }
};
