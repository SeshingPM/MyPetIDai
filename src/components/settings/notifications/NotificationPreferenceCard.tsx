
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { UserPreferences } from '@/contexts/userPreferences';

interface NotificationPreferenceCardProps {
  children: React.ReactNode;
  loading: boolean;
  error: string | null;
}

const NotificationPreferenceCard: React.FC<NotificationPreferenceCardProps> = ({ 
  children,
  loading,
  error
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Configure how you receive reminders and notifications from PetDocument
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default NotificationPreferenceCard;
