
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReminderTabs from '@/components/reminders/ReminderTabs';
import ReminderDialogs from '@/components/reminders/ReminderDialogs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ReminderProvider, useReminders } from '@/contexts/reminders';
import FadeIn from '@/components/animations/FadeIn';

const RemindersContent: React.FC = () => {
  const { setIsAddReminderDialogOpen } = useReminders();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-0">
      <div className="relative isolate overflow-hidden">
        {/* Background blurs */}
        <div className="absolute -top-40 -right-20 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute top-60 -left-20 w-80 h-80 bg-pet-purple/20 rounded-full filter blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 right-10 w-60 h-60 bg-pet-blue/20 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        
        <FadeIn delay={100}>
          <div className="flex items-center justify-between mb-8 sm:mb-6">
            <h1 className="text-2xl font-bold">Reminders</h1>
            <Button onClick={() => setIsAddReminderDialogOpen(true)} className="bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm">
              <Plus size={16} className="mr-2" />
              Add Reminder
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <ReminderTabs />
        </FadeIn>
        
        <ReminderDialogs />
      </div>
    </div>
  );
};

const Reminders: React.FC = () => {
  return (
    <DashboardLayout>
      <ReminderProvider>
        <RemindersContent />
      </ReminderProvider>
    </DashboardLayout>
  );
};

export default Reminders;
