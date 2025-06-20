
import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Bell, 
  PawPrint, 
  Activity
} from 'lucide-react';
import {
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar/index";

const NavItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    color: "#4F46E5" // Indigo color
  },
  {
    title: "Pets",
    icon: PawPrint,
    path: "/pets",
    color: "#EC4899" // Pink color
  },
  {
    title: "Documents",
    icon: FileText,
    path: "/documents",
    color: "#3B82F6" // Blue color
  },
  {
    title: "Health Check",
    icon: Activity,
    path: "/health-check",
    color: "#10B981" // Green color
  },
  {
    title: "Reminders",
    icon: Bell,
    path: "/reminders",
    color: "#F59E0B" // Amber color
  }
];

// Define proper interface for NavMenuItem props
interface NavMenuItemProps {
  item: {
    title: string;
    icon: React.ComponentType<any>;
    path: string;
    color: string;
  };
  isActive: boolean;
}

// Move NavMenuItem to a separate component for memoization
const NavMenuItem = React.memo<NavMenuItemProps>(({ item, isActive }) => (
  <SidebarMenuItem key={item.title}>
    <SidebarMenuButton 
      isActive={isActive}
      tooltip={item.title}
      asChild
    >
      <Link to={item.path}>
        <item.icon className="h-5 w-5" style={{ color: item.color }} />
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
));

NavMenuItem.displayName = 'NavMenuItem';

const NavigationSection = () => {
  const location = useLocation();
  
  // Memoize whether each nav item is active to prevent unnecessary re-renders
  const navItemsWithActive = useMemo(() => 
    NavItems.map(item => ({
      ...item,
      isActive: location.pathname === item.path
    })),
    [location.pathname]
  );
  
  return (
    <>
      <SidebarSeparator />
      
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navItemsWithActive.map((item) => (
              <NavMenuItem 
                key={item.title}
                item={item}
                isActive={item.isActive}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

export default React.memo(NavigationSection);
