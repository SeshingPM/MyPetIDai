import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from './OverviewTab';
import PetsTab from './overview/PetsSection';
import DocumentsTab from './overview/DocumentsContainer';
import HealthCheckTab from './HealthCheckTab';

const DashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="overview" className="w-full space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="pets">Pets</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="health">Health Check</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <OverviewTab />
      </TabsContent>
      <TabsContent value="pets">
        <PetsTab />
      </TabsContent>
      <TabsContent value="documents">
        <DocumentsTab />
      </TabsContent>
      <TabsContent value="health">
        <HealthCheckTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
