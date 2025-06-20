
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FadeIn from '@/components/animations/FadeIn';
import { useReminders } from '@/contexts/reminders';
import RemindersSectionHeader from './reminders/RemindersSectionHeader';
import RemindersSectionContent from './reminders/RemindersSectionContent';
import ReminderDialogs from '@/components/reminders/ReminderDialogs';

const RemindersSection: React.FC = () => {
  const { 
    todayReminders, 
    upcomingReminders,
    loading,
    error
  } = useReminders();
  
  // Combine today's and upcoming reminders for the overview
  const displayReminders = [...todayReminders, ...upcomingReminders]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <FadeIn delay={500}>
      <Card className="bg-white/80 shadow-sm border-gray-100 overflow-hidden relative h-full">
        {/* Modern background blur effects - reduced size */}
        <div className="absolute top-0 right-0 h-28 w-28 bg-pet-pink/20 rounded-full -mr-14 -mt-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-20 w-20 bg-blue-300/20 rounded-full -ml-6 -mb-6 blur-3xl"></div>
        
        <RemindersSectionHeader />
        
        <CardContent className="relative z-10 pt-0 pb-3">
          <RemindersSectionContent 
            displayReminders={displayReminders}
            loading={loading}
            error={error}
          />
        </CardContent>
        
        {/* Add ReminderDialogs to enable edit/reschedule functionality */}
        <ReminderDialogs />
      </Card>
    </FadeIn>
  );
};

export default RemindersSection;
