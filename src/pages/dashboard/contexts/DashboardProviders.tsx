import React from 'react';
import { DialogProvider } from './DialogContext';
import { DocumentsProvider } from '@/contexts/DocumentsContext';
import { HealthProvider } from '@/contexts/health';
import { ReminderProvider } from '@/contexts/reminders';

interface DashboardProvidersProps {
  children: React.ReactNode;
}

export const DashboardProviders: React.FC<DashboardProvidersProps> = ({ children }) => {
  return (
    <DialogProvider>
      <DocumentsProvider>
        <HealthProvider>
          <ReminderProvider>
            {children}
          </ReminderProvider>
        </HealthProvider>
      </DocumentsProvider>
    </DialogProvider>
  );
};
