import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logger from '@/utils/logger';

// Define the Activity type that's used in ActivityOverview
export interface Activity {
  id: string;
  user_id: string;
  action: string;
  created_at: string;
  entity_type: string;
  entity_id: string;
  // Display properties for the UI
  type: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface AdminStats {
  total_users: number;
  // User engagement metrics (replaced subscription data as product is now free)
  user_engagement: {
    active_users: number;
    returning_users: number;
  };
  total_pets: number;
  recent_signups: number;
  recent_activities?: Activity[];
}

export async function fetchAdminStats(period: string = '7d'): Promise<AdminStats> {
  try {
    logger.info('Fetching admin stats for period:', period);
    
    // We need to convert the period string to days number for the function parameter
    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
    
    const { data, error } = await supabase.rpc('get_admin_stats', {
      period_days: days
    });

    if (error) {
      logger.error('Error fetching admin stats:', error);
      toast.error('Failed to load admin statistics');
      throw error;
    }

    logger.info('Received admin stats:', data);
    
    // If no data was returned, provide fallback data
    if (!data) {
      logger.warn('No admin stats data returned, using fallback data');
      return {
        total_users: 0,
        // User engagement metrics for platform usage
        user_engagement: {
          active_users: 0,
          returning_users: 0
        },
        total_pets: 0,
        recent_signups: 0,
        recent_activities: []
      };
    }

    // Explicitly cast data to unknown first, then to AdminStats to satisfy TypeScript
    return data as unknown as AdminStats;
  } catch (error) {
    logger.error('Failed to fetch admin stats:', error);
    toast.error('Failed to load admin statistics');
    
    // Return fallback data on error
    return {
      total_users: 0,
      user_engagement: {
        active_users: 0,
        returning_users: 0
      },
      total_pets: 0,
      recent_signups: 0,
      recent_activities: []
    };
  }
}
