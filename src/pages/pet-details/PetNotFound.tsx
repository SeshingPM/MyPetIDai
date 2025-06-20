
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Header from '@/components/layout/Header';

const PetNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-max">
          <div className="text-center">
            <h1 className="text-2xl font-medium mb-4">Pet not found</h1>
            <p className="text-gray-500 mb-6">
              The pet you're looking for either doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => navigate('/pets')}>Back to Pets</Button>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default PetNotFound;
