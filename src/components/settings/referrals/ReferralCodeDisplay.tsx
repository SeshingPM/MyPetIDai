
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ReferralCode } from './types';

interface ReferralCodeDisplayProps {
  referralCode: ReferralCode;
}

const ReferralCodeDisplay: React.FC<ReferralCodeDisplayProps> = ({ referralCode }) => {
  const [copiedLink, setCopiedLink] = useState(false);

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
    <div className="space-y-4">
      <div>
        <Label htmlFor="current-code">Your Current Code</Label>
        <div className="flex mt-1.5">
          <Input 
            id="current-code"
            value={referralCode.unique_code || ''}
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
        <p className="text-sm font-medium mb-2">Referral Stats</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Referrals</p>
            <p className="text-lg font-semibold">{referralCode.used_count || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralCodeDisplay;
