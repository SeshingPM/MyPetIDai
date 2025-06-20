
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface ReferralData {
  code: string | null;
  unique_code: string | null;
  points: number | null;
  count: number | null;
}

const ReferralCard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [referralData, setReferralData] = useState<ReferralData>({
    code: null,
    unique_code: null,
    points: 0,
    count: 0
  });
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);
  
  const fetchReferralData = async () => {
    setIsLoading(true);
    try {
      // Get referral code
      const { data: codeData, error: codeError } = await supabase
        .from('referral_codes')
        .select('unique_code, used_count')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (codeError) throw codeError;
      
      // Get referral points
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('referral_points')
        .eq('id', user?.id)
        .maybeSingle();
      
      if (profileError) throw profileError;
      
      setReferralData({
        code: codeData?.unique_code || null,
        unique_code: codeData?.unique_code || null,
        points: profileData?.referral_points || 0,
        count: codeData?.used_count || 0
      });
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getReferralUrl = () => {
    return `${window.location.origin}/onboarding?ref=${referralData.unique_code || ''}`;
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getReferralUrl());
    setCopied(true);
    toast.success('Referral link copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Referrals</h3>
          <div className="bg-primary/10 rounded-full p-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Referral Points</p>
              <p className="text-xl font-semibold">{referralData.points || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Successful Referrals</p>
              <p className="text-xl font-semibold">{referralData.count || 0}</p>
            </div>
          </div>
          
          {referralData.unique_code ? (
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Referral Link</span>
                </>
              )}
            </Button>
          ) : (
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = '/settings'}
            >
              Set up your referral code
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;
