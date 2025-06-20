
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthButtonsProps {
  isAuthenticated: boolean;
  isMobile?: boolean;
  handleSignOut: (e: React.MouseEvent) => Promise<void>;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ 
  isAuthenticated, 
  isMobile = false,
  handleSignOut
}) => {
  if (isAuthenticated) {
    if (isMobile) {
      return (
        <>
          <Button asChild className="w-full">
            <Link to="/dashboard">My Pet's Identity</Link>
          </Button>
          <Button variant="outline" onClick={handleSignOut} className="w-full">
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </>
      );
    }
    
    return (
      <Button asChild className="btn-primary">
        <Link to="/dashboard">My Pet's Identity</Link>
      </Button>
    );
  }
  
  // Not authenticated - Focus on free platform
  if (isMobile) {
    return (
      <>
        <Button asChild variant="outline" className="w-full">
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild className="w-full">
          <Link to="/onboarding">Create Free Pet ID</Link>
        </Button>
      </>
    );
  }
  
  return (
    <>
      <Button asChild variant="ghost" className="text-gray-700 hover:text-primary">
        <Link to="/login">Login</Link>
      </Button>
      <Button asChild className="btn-primary">
        <Link to="/onboarding">Create Free Pet ID</Link>
      </Button>
    </>
  );
};

export default AuthButtons;
