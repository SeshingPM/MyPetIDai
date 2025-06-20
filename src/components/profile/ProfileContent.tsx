
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
// All features are now free - subscription modal removed

const ProfileContent: React.FC = () => {
  const { user } = useAuth();
  // All features are now free - subscription state removed

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (!user) return '?';
    
    const fullName = user.user_metadata?.full_name;
    if (fullName) {
      const names = fullName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return fullName[0].toUpperCase();
    }
    
    return user.email?.[0].toUpperCase() || '?';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24 border-2 border-primary/10">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-xl font-semibold">
                {user?.user_metadata?.full_name || user?.email || 'User Profile'}
              </h2>
              <p className="text-muted-foreground">
                {user?.email}
              </p>
              <p className="text-sm text-muted-foreground">
                Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium mb-2">Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your notification and display preferences
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => {}}
              >
                <CreditCard className="h-4 w-4" />
                <span>Account</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium mb-2">Referrals</h3>
                <p className="text-sm text-muted-foreground">
                  Share your referral link with friends to earn points
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="flex items-center gap-1"
              >
                <Link to="/referrals">
                  <span>Go to Referrals</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription modal removed - all features are now free */}
    </div>
  );
};

export default ProfileContent;
