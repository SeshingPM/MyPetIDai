
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FadeIn from '@/components/animations/FadeIn';
import OverviewTab from './tabs/OverviewTab';
import PetsTab from './tabs/PetsTab';
import DocumentsTab from './tabs/DocumentsTab';
import HealthCheckTab from './tabs/HealthCheckTab';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home, PawPrint, FileText, Activity } from 'lucide-react';

// Enhanced TabItem component with improved accessibility and visual feedback
const TabItem: React.FC<{
  value: string;
  icon: React.ReactNode;
  label: string;
}> = ({ value, icon, label }) => (
  <TabsTrigger 
    value={value} 
    className="flex items-center gap-2 py-2.5 px-4 text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300 hover:bg-gray-200/70"
    aria-label={label}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </TabsTrigger>
);

const DashboardTabs: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <Tabs defaultValue="overview" className="space-y-6 mt-4">
      <FadeIn delay={200}>
        <div className="sticky top-0 z-10 backdrop-blur-sm bg-background/80 pt-2 pb-4">
          <TabsList className="grid grid-cols-4 md:w-fit bg-gray-100/80 p-1.5 rounded-xl">
            <TabItem 
              value="overview" 
              icon={<Home size={18} />} 
              label="Overview" 
            />
            <TabItem 
              value="pets" 
              icon={<PawPrint size={18} />} 
              label="Pets" 
            />
            <TabItem 
              value="documents" 
              icon={<FileText size={18} />} 
              label="Documents" 
            />
            <TabItem 
              value="health" 
              icon={<Activity size={18} />} 
              label="Health" 
            />
          </TabsList>
        </div>
      </FadeIn>
      
      <TabsContent value="overview" className="space-y-4 mt-0 pt-0">
        <OverviewTab />
      </TabsContent>
      
      <TabsContent value="pets" className="space-y-4 mt-0 pt-0">
        <PetsTab />
      </TabsContent>
      
      <TabsContent value="documents" className="space-y-4 mt-0 pt-0">
        <DocumentsTab />
      </TabsContent>
      
      <TabsContent value="health" className="space-y-4 mt-0 pt-0">
        <HealthCheckTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
