
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';
import PetDetailsSkeleton from './PetDetailsSkeleton';

const LoadingState: React.FC = () => {
  return (
    <DashboardLayout>
      <Header />
      <main className="pt-24 pb-16">
        <PetDetailsSkeleton />
      </main>
    </DashboardLayout>
  );
};

export default LoadingState;
