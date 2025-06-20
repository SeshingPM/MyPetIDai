
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Settings, 
  LogOut,
  UserRound,
  MessageSquare,
  Users,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar/index";
import FeedbackDialog from '@/components/feedback/FeedbackDialog';
import { supabase } from '@/integrations/supabase/client';

const iconColors = {
  profile: "#8B5CF6",
  feedback: "#EA580C",
  settings: "#0EA5E9",
  referrals: "#10B981",
  signout: "#EF4444",
  admin: "#DC2626"
};

const UserMenuSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      navigate('/', { replace: true });
    }
  };
  
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = React.useState(true);

  React.useEffect(() => {
    const checkAdminStatus = async () => {
      setIsCheckingAdmin(true);
      try {
        const { data, error } = await supabase.rpc('is_admin');
        if (!error) {
          setIsAdmin(data);
        } else {
          console.error('Error checking admin status:', error);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    if (user) {
      checkAdminStatus();
    } else {
      setIsCheckingAdmin(false);
    }
  }, [user]);
  
  return (
    <>
      <SidebarSeparator />
      
      <SidebarGroup>
        <SidebarGroupLabel>User</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Profile"
                isActive={location.pathname === "/profile"}
                asChild
              >
                <Link to="/profile">
                  <UserRound className="h-5 w-5" style={{ color: iconColors.profile }} />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Referrals"
                isActive={location.pathname === "/referrals"}
                asChild
              >
                <Link to="/referrals">
                  <Users className="h-5 w-5" style={{ color: iconColors.referrals }} />
                  <span>Referrals</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Feedback"
              >
                <FeedbackDialog trigger={
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5" style={{ color: iconColors.feedback }} />
                    <span>Feedback</span>
                  </div>
                } />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Settings"
                isActive={location.pathname === "/settings"}
                asChild
              >
                <Link to="/settings">
                  <Settings className="h-5 w-5" style={{ color: iconColors.settings }} />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Sign Out"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5" style={{ color: iconColors.signout }} />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {!isCheckingAdmin && isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Admin Dashboard"
                  isActive={location.pathname.startsWith("/admin")}
                  asChild
                >
                  <Link to="/admin">
                    <ShieldCheck className="h-5 w-5" style={{ color: iconColors.admin }} />
                    <span>Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

export default UserMenuSection;
