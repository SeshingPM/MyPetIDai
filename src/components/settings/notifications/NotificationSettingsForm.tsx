
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RefreshCw } from 'lucide-react';
import EmailNotificationToggle from './EmailNotificationToggle';
import NotificationTimingOptions from './NotificationTimingOptions';
import { UserPreferences } from '@/contexts/userPreferences';

export interface NotificationSettingsFormProps {
  preferences: UserPreferences | null;
  updateEmailNotifications: (enabled: boolean) => Promise<void>;
  updateReminderAdvanceNotice: (hours: number) => Promise<void>;
  updateReminderTime: (time: string) => Promise<void>;
  retryLoading: () => Promise<void>;
}

const NotificationSettingsForm: React.FC<NotificationSettingsFormProps> = ({
  preferences,
  updateEmailNotifications,
  updateReminderAdvanceNotice,
  updateReminderTime,
  retryLoading
}) => {
  const handleEmailToggle = async (checked: boolean) => {
    await updateEmailNotifications(checked);
  };
  
  const handleAdvanceNoticeChange = async (value: string) => {
    await updateReminderAdvanceNotice(parseInt(value));
  };
  
  const handleReminderTimeChange = async (value: string) => {
    await updateReminderTime(`${value}:00`);
  };

  return (
    <form className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Reminder Notifications</h3>
        
        <div className="space-y-4">
          <EmailNotificationToggle 
            enabled={preferences?.emailNotifications || false}
            onToggle={handleEmailToggle}
          />
          
          <Separator />
          
          <NotificationTimingOptions 
            reminderAdvanceNotice={preferences?.reminderAdvanceNotice}
            reminderTime={preferences?.reminderTime}
            emailNotificationsEnabled={preferences?.emailNotifications || false}
            onAdvanceNoticeChange={handleAdvanceNoticeChange}
            onReminderTimeChange={handleReminderTimeChange}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="flex justify-end">
        <Button 
          type="button" 
          variant="outline"
          className="flex items-center gap-2"
          onClick={retryLoading}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    </form>
  );
};

export default NotificationSettingsForm;
