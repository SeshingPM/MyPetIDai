import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PetsPageContent from './pets/PetsPageContent';
import SEO from '@/components/seo/SEO';

const PetsPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Your Pets | MyPetID" 
        description="Manage your pets' profiles, health records, and important documents all in one place."
      />
      <DashboardLayout>
        <PetsPageContent />
      </DashboardLayout>
    </>
  );
};

export default PetsPage;
