
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ReferralCode } from './types';
import { toast } from 'sonner';

export const useReferralCode = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchReferralCode();
    }
  }, [user]);

  const fetchReferralCode = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Cast to ReferralCode type
        const typedData = data as unknown as ReferralCode;
        setReferralCode(typedData);
      }
    } catch (error) {
      console.error('Error fetching referral code:', error);
      toast.error('Could not load your referral code');
    } finally {
      setIsLoading(false);
    }
  };

  const saveReferralCode = async (code: string) => {
    if (!code) return;
    
    setIsSaving(true);
    try {
      // Check one more time before saving
      const { data: existingCode, error: checkError } = await supabase
        .from('referral_codes')
        .select('unique_code')
        .eq('unique_code', code)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingCode) {
        toast.error('This referral code is already taken. Please choose another.');
        setIsSaving(false);
        return false;
      }

      if (referralCode) {
        // Update existing code
        const { error } = await supabase
          .from('referral_codes')
          .update({
            unique_code: code
          })
          .eq('id', referralCode.id);

        if (error) throw error;
      } else {
        // Create new code
        const { error } = await supabase
          .from('referral_codes')
          .insert({
            user_id: user?.id,
            code: code,
            unique_code: code,
            is_active: true,
            used_count: 0
          });

        if (error) throw error;
      }

      toast.success('Referral code saved successfully!');
      await fetchReferralCode();
      return true;
    } catch (error) {
      console.error('Error saving referral code:', error);
      toast.error('Could not save your referral code');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading,
    isSaving,
    referralCode,
    fetchReferralCode,
    saveReferralCode
  };
};
