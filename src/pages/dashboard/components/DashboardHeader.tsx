
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AddNewDropdown from './header/AddNewDropdown';
import FadeIn from '@/components/animations/FadeIn';


const DashboardHeader: React.FC = () => {
  const { user } = useAuth();
  
  // Format greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get user's first name
  const getFirstName = () => {
    if (!user) return "";
    
    const fullName = user.user_metadata?.full_name;
    if (fullName) {
      return fullName.split(' ')[0];
    }
    
    // Fallback to email
    return user.email?.split('@')[0] || "";
  };

  return (
    <div className="mb-6 mt-4">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}, {getFirstName()}!
              </h1>
            </div>
            <p className="text-gray-500 mt-1">
              Here's what's happening with your pets today.
            </p>
          </div>
          
          <AddNewDropdown />
        </div>
      </FadeIn>
    </div>
  );
};

export default DashboardHeader;
