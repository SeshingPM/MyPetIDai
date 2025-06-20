
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActiveRemindersTab from './tabs/ActiveRemindersTab';
import ArchivedRemindersTab from './tabs/ArchivedRemindersTab';

const ReminderTabs: React.FC = () => {
  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="w-full md:w-auto mb-4 bg-gray-100/80 p-1 rounded-xl">
        <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
          Active
        </TabsTrigger>
        <TabsTrigger value="archive" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
          Archive
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="active">
        <ActiveRemindersTab />
      </TabsContent>
      
      <TabsContent value="archive">
        <ArchivedRemindersTab />
      </TabsContent>
    </Tabs>
  );
};

export default ReminderTabs;
