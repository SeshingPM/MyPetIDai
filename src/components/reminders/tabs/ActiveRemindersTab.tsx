
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RemindersList from '../RemindersList';
import { useReminders } from '@/contexts/reminders';
import { ReminderProps } from '../ReminderCard';

const ActiveRemindersTab: React.FC = () => {
  const {
    activeReminders,
    todayReminders,
    upcomingReminders,
    overdueReminders,
    handleCompleteReminder,
    handleOpenRescheduleDialog,
    handleOpenEditDialog,
  } = useReminders();

  return (
    <Tabs defaultValue="all" className="mt-4">
      {/* Mobile view - only visible on small screens */}
      <div className="flex justify-center mb-6 sm:hidden">
        <div className="w-full max-w-md">
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-gray-100/80 p-2 rounded-lg">
              <TabsList className="bg-transparent w-full">
                <TabsTrigger value="all" className="w-full rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  All Reminders
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="bg-gray-100/80 p-2 rounded-lg">
              <TabsList className="bg-transparent w-full">
                <TabsTrigger 
                  value="today" 
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg text-amber-700 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <div className="bg-amber-100 rounded-full p-1">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  </div>
                  <span>Today</span>
                  {todayReminders.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">
                      {todayReminders.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="bg-gray-100/80 p-2 rounded-lg">
              <TabsList className="bg-transparent w-full">
                <TabsTrigger 
                  value="upcoming" 
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg text-blue-700 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <div className="bg-blue-100 rounded-full p-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span>Upcoming</span>
                  {upcomingReminders.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                      {upcomingReminders.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="bg-gray-100/80 p-2 rounded-lg">
              <TabsList className="bg-transparent w-full">
                <TabsTrigger 
                  value="overdue" 
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg text-red-700 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <div className="bg-red-100 rounded-full p-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span>Overdue</span>
                  {overdueReminders.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                      {overdueReminders.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop view - only visible on medium screens and up */}
      <div className="hidden sm:flex sm:justify-center sm:mb-6">
        <TabsList className="flex-wrap bg-gray-100/80 p-1 rounded-xl">
          <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            All Reminders
          </TabsTrigger>
          
          <TabsTrigger 
            value="today" 
            className="flex items-center gap-1.5 rounded-lg text-amber-700 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <div className="bg-amber-100 rounded-full p-1">
              <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
            </div>
            <span>Today</span>
            {todayReminders.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">
                {todayReminders.length}
              </span>
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="upcoming" 
            className="flex items-center gap-1.5 rounded-lg text-blue-700 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <div className="bg-blue-100 rounded-full p-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            <span>Upcoming</span>
            {upcomingReminders.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                {upcomingReminders.length}
              </span>
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="overdue" 
            className="flex items-center gap-1.5 rounded-lg text-red-700 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <div className="bg-red-100 rounded-full p-1">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            </div>
            <span>Overdue</span>
            {overdueReminders.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                {overdueReminders.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="all" className="mt-8 sm:mt-6 animate-fade-in-up">
        <RemindersList
          reminders={activeReminders}
          onComplete={handleCompleteReminder}
          onReschedule={handleOpenRescheduleDialog}
          onEdit={handleOpenEditDialog}
        />
      </TabsContent>
      
      <TabsContent value="today" className="mt-8 sm:mt-6 animate-fade-in-up">
        {todayReminders.length > 0 ? (
          <RemindersList
            reminders={todayReminders}
            onComplete={handleCompleteReminder}
            onReschedule={handleOpenRescheduleDialog}
            onEdit={handleOpenEditDialog}
          />
        ) : (
          <div className="text-center py-12 bg-amber-50/50 rounded-lg border border-dashed border-amber-200">
            <p className="text-amber-700">No reminders for today</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="upcoming" className="mt-8 sm:mt-6 animate-fade-in-up">
        {upcomingReminders.length > 0 ? (
          <RemindersList
            reminders={upcomingReminders}
            onComplete={handleCompleteReminder}
            onReschedule={handleOpenRescheduleDialog}
            onEdit={handleOpenEditDialog}
          />
        ) : (
          <div className="text-center py-12 bg-blue-50/50 rounded-lg border border-dashed border-blue-200">
            <p className="text-blue-700">No upcoming reminders</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="overdue" className="mt-8 sm:mt-6 animate-fade-in-up">
        {overdueReminders.length > 0 ? (
          <RemindersList
            reminders={overdueReminders}
            onComplete={handleCompleteReminder}
            onReschedule={handleOpenRescheduleDialog}
            onEdit={handleOpenEditDialog}
          />
        ) : (
          <div className="text-center py-12 bg-red-50/50 rounded-lg border border-dashed border-red-200">
            <p className="text-red-700">No overdue reminders</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ActiveRemindersTab;
