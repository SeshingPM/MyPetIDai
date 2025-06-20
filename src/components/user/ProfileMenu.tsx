
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Settings, UserRound, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProfileMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Extract initials for avatar fallback
  const getInitials = () => {
    if (!user) return '?';
    
    // Try to get from user metadata if available
    const fullName = user.user_metadata?.full_name;
    if (fullName) {
      const names = fullName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return fullName[0].toUpperCase();
    }
    
    // Fallback to email
    return user.email?.[0].toUpperCase() || '?';
  };
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100 rounded-full p-0 h-auto">
            <Avatar className="h-9 w-9 border-2 border-primary/10">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="min-w-[220px] p-2 right-0 left-auto">
            <div className="p-2 border-b mb-2">
              <p className="font-medium text-sm">
                {user?.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            
            <NavigationMenuLink asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 py-2 px-3 text-sm cursor-pointer"
                )}
                onClick={() => navigate('/profile')}
              >
                <UserRound size={16} />
                <span>Profile</span>
              </Button>
            </NavigationMenuLink>
            
            <NavigationMenuLink asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 py-2 px-3 text-sm cursor-pointer"
                )}
                onClick={() => navigate('/settings')}
              >
                <Settings size={16} />
                <span>Settings</span>
              </Button>
            </NavigationMenuLink>
            
            <NavigationMenuLink asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 py-2 px-3 text-sm cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                )}
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </Button>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default ProfileMenu;
