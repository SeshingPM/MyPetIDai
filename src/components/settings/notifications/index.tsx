
import React from 'react';
import NotificationSettingsForm from './NotificationSettingsForm';
import ReferralsTab from '../ReferralsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Users } from 'lucide-react';
import { useUserPreferences } from '@/contexts/userPreferences';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

const NotificationsSettings: React.FC = () => {
  const {
    preferences,
    loading,
    error,
    updateEmailNotifications,
    updateReminderAdvanceNotice,
    updateReminderTime,
    retryLoading
  } = useUserPreferences();

  return (
    <Tabs defaultValue="notifications" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell size={16} />
          <span>Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="referrals" className="flex items-center gap-2">
          <Users size={16} />
          <span>Referrals</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="notifications">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={retryLoading} />
        ) : (
          <NotificationSettingsForm 
            preferences={preferences}
            updateEmailNotifications={updateEmailNotifications}
            updateReminderAdvanceNotice={updateReminderAdvanceNotice}
            updateReminderTime={updateReminderTime}
            retryLoading={retryLoading}
          />
        )}
      </TabsContent>
      
      <TabsContent value="referrals">
        <ReferralsTab />
      </TabsContent>
    </Tabs>
  );
};

export default NotificationsSettings;
