
import React from 'react';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar/index";

import UserProfileSection from './UserProfileSection';
import NavigationSection from './NavigationSection';
import UserMenuSection from './UserMenuSection';
import SidebarFooterSection from './SidebarFooterSection';

const PetSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 pt-2">
          <UserProfileSection />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Main navigation */}
        <NavigationSection />
        
        {/* User menu */}
        <UserMenuSection />
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarFooterSection />
      </SidebarFooter>
    </Sidebar>
  );
};

export default PetSidebar;
