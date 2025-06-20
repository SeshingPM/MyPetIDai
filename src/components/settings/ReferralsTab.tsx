
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReferralCode } from './referrals/useReferralCode';
import ReferralCodeForm from './referrals/ReferralCodeForm';
import ReferralCodeDisplay from './referrals/ReferralCodeDisplay';
import LoadingState from './referrals/LoadingState';

const ReferralsTab: React.FC = () => {
  const { isLoading, isSaving, referralCode, saveReferralCode } = useReferralCode();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Referral Code</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState />
          ) : referralCode?.unique_code ? (
            <ReferralCodeDisplay referralCode={referralCode} />
          ) : (
            <ReferralCodeForm onSubmit={saveReferralCode} isSaving={isSaving} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralsTab;
