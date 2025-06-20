
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReferralContent from '@/components/referrals/ReferralContent';
import FadeIn from '@/components/animations/FadeIn';

const Referrals: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative isolate overflow-hidden">
          {/* Background blurs */}
          <div className="absolute -top-40 -right-20 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl opacity-20 -z-10"></div>
          <div className="absolute top-60 -left-20 w-80 h-80 bg-pet-purple/20 rounded-full filter blur-3xl opacity-30 -z-10"></div>
          <div className="absolute bottom-0 right-10 w-60 h-60 bg-pet-blue/20 rounded-full filter blur-3xl opacity-20 -z-10"></div>

          <FadeIn delay={100}>
            <h1 className="text-2xl font-bold mb-6">Referrals</h1>
          </FadeIn>
          
          <FadeIn delay={200}>
            <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100/80 backdrop-blur-sm">
              <ReferralContent />
            </div>
          </FadeIn>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Referrals;
