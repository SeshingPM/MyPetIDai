
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ReminderProvider } from '@/contexts/reminders';
import ReminderDialogs from '@/components/reminders/ReminderDialogs';
import PetsPageContent from './PetsPageContent';
import { Toaster } from 'sonner';

const PetsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <ReminderProvider>
        <PetsPageContent />
        <ReminderDialogs />
        <Toaster position="top-center" />
      </ReminderProvider>
    </DashboardLayout>
  );
};

export default PetsPage;
