
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserProfileSection = () => {
  const { user } = useAuth();
  
  // Helper function to get user initials for the avatar
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

  // If user is not authenticated, show nothing
  if (!user) {
    return null;
  }
  
  // Show user profile
  return (
    <div className="px-3 py-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-primary/10">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        {/* Fixed width container with overflow handling */}
        <div className="max-w-[100px] overflow-hidden">
          <p className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {user?.user_metadata?.full_name || 'User'}
          </p>
          <p className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;
