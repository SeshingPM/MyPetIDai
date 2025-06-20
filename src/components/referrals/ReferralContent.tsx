
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Copy, Check, Users } from 'lucide-react';

interface ReferralCode {
  id: string;
  user_id: string;
  code: string;
  unique_code: string | null;
  created_at: string;
  is_active: boolean;
  used_count: number;
}

const ReferralContent: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [codeExists, setCodeExists] = useState(false);
  const [referralPoints, setReferralPoints] = useState(0);
  const [newCode, setNewCode] = useState('');

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
        .select('*')
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

      setReferralCode(codeData);
      setReferralPoints(profileData?.referral_points || 0);
    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast.error('Could not load your referral data');
    } finally {
      setIsLoading(false);
    }
  };

  const checkCodeAvailability = async () => {
    if (!newCode) return;
    
    setIsChecking(true);
    try {
      // Direct query to check if code exists
      const { data, error } = await supabase
        .from('referral_codes')
        .select('unique_code')
        .eq('unique_code', newCode)
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

  const saveReferralCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || codeExists) return;
    
    setIsSaving(true);
    try {
      if (referralCode) {
        // Update existing code
        const { error } = await supabase
          .from('referral_codes')
          .update({
            unique_code: newCode
          })
          .eq('id', referralCode.id);

        if (error) throw error;
      } else {
        // Create new code
        const { error } = await supabase
          .from('referral_codes')
          .insert({
            user_id: user?.id,
            code: newCode,
            unique_code: newCode,
            is_active: true,
            used_count: 0
          });

        if (error) throw error;
      }

      toast.success('Referral code saved successfully!');
      fetchReferralData();
    } catch (error) {
      console.error('Error saving referral code:', error);
      toast.error('Could not save your referral code');
    } finally {
      setIsSaving(false);
    }
  };

  const copyReferralLink = () => {
    if (!referralCode?.unique_code) return;
    
    const link = `${window.location.origin}/onboarding?ref=${referralCode.unique_code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast.success('Referral link copied to clipboard');
    
    setTimeout(() => {
      setCopiedLink(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Your Referrals</h2>
          <p className="text-muted-foreground">Share your referral link with friends to earn points</p>
        </div>
        <div className="bg-primary/10 p-2 rounded-full">
          <Users className="h-6 w-6 text-primary" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Referral Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Referral Points</p>
                  <p className="text-2xl font-semibold">{referralPoints}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Successful Referrals</p>
                  <p className="text-2xl font-semibold">{referralCode?.used_count || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{referralCode?.unique_code ? 'Your Referral Link' : 'Create Your Referral Code'}</CardTitle>
            </CardHeader>
            <CardContent>
              {referralCode?.unique_code ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-code">Your Referral Code</Label>
                    <div className="flex mt-1.5">
                      <Input 
                        id="current-code"
                        value={referralCode.unique_code}
                        readOnly
                        className="rounded-r-none"
                      />
                      <Button 
                        variant="outline" 
                        className="rounded-l-none border-l-0"
                        onClick={copyReferralLink}
                      >
                        {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Share this code with friends to earn referral points
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm">Want to change your code?</p>
                    <form onSubmit={saveReferralCode} className="mt-2 space-y-4">
                      <div>
                        <div className="flex">
                          <Input 
                            placeholder="New referral code"
                            value={newCode}
                            onChange={(e) => {
                              setNewCode(e.target.value);
                              setCodeExists(false);
                            }}
                            onBlur={checkCodeAvailability}
                            className="rounded-r-none"
                          />
                          <Button 
                            type="submit" 
                            disabled={isSaving || isChecking || codeExists || !newCode}
                            className="rounded-l-none"
                          >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Update
                          </Button>
                        </div>
                        {codeExists && (
                          <p className="text-sm text-destructive mt-1">This code is already taken</p>
                        )}
                        {isChecking && (
                          <p className="text-sm text-muted-foreground mt-1">Checking availability...</p>
                        )}
                        {!isChecking && newCode && !codeExists && (
                          <p className="text-sm text-green-600 mt-1">This code is available</p>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <form onSubmit={saveReferralCode} className="space-y-4">
                  <div>
                    <Label htmlFor="code">Create Your Referral Code</Label>
                    <div className="flex mt-1.5">
                      <Input 
                        id="code"
                        placeholder="yourcode"
                        value={newCode}
                        onChange={(e) => {
                          setNewCode(e.target.value);
                          setCodeExists(false);
                        }}
                        onBlur={checkCodeAvailability}
                        className="rounded-r-none"
                      />
                      <Button 
                        type="submit" 
                        disabled={isSaving || isChecking || codeExists || !newCode}
                        className="rounded-l-none"
                      >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Create
                      </Button>
                    </div>
                    {codeExists && (
                      <p className="text-sm text-destructive mt-1">This code is already taken</p>
                    )}
                    {isChecking && (
                      <p className="text-sm text-muted-foreground mt-1">Checking availability...</p>
                    )}
                    {!isChecking && newCode && !codeExists && (
                      <p className="text-sm text-green-600 mt-1">This code is available</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      Create a unique code that others can use to sign up through your referral
                    </p>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ReferralContent;
