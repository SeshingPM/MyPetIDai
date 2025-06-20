
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useReferralCodeValidation = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [codeExists, setCodeExists] = useState(false);

  const checkCodeAvailability = async (code: string) => {
    if (!code) return;
    
    setIsChecking(true);
    try {
      // Direct query to check if code exists
      const { data, error } = await supabase
        .from('referral_codes')
        .select('unique_code')
        .eq('unique_code', code)
        .maybeSingle();
        
      if (error) throw error;
      
      // If we find data, code exists (not available)
      setCodeExists(!!data);
    } catch (error) {
      console.error('Error checking code:', error);
    } finally {
      setIsChecking(false);
    }
  };

  return {
    isChecking,
    codeExists,
    setCodeExists,
    checkCodeAvailability
  };
};
