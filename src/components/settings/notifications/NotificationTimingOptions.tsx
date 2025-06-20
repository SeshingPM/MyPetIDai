
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NotificationTimingOptionsProps {
  reminderAdvanceNotice: number | undefined;
  reminderTime: string | undefined;
  emailNotificationsEnabled: boolean;
  onAdvanceNoticeChange: (value: string) => Promise<void>;
  onReminderTimeChange: (value: string) => Promise<void>;
}

const NotificationTimingOptions: React.FC<NotificationTimingOptionsProps> = ({
  reminderAdvanceNotice,
  reminderTime,
  emailNotificationsEnabled,
  onAdvanceNoticeChange,
  onReminderTimeChange
}) => {
  // Extract hour from time
  const getHourFromTime = (timeString: string | undefined) => {
    if (!timeString) return '09';
    return timeString.substring(0, 2);
  };

  return (
    <div>
      <h4 className="font-medium mb-2">Notification Timing</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="advance-notice">Send Notifications</Label>
          <Select 
            value={reminderAdvanceNotice?.toString() || '24'} 
            onValueChange={onAdvanceNoticeChange}
            disabled={!emailNotificationsEnabled}
          >
            <SelectTrigger id="advance-notice">
              <SelectValue placeholder="24 hours before" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 hour before</SelectItem>
              <SelectItem value="2">2 hours before</SelectItem>
              <SelectItem value="4">4 hours before</SelectItem>
              <SelectItem value="8">8 hours before</SelectItem>
              <SelectItem value="12">12 hours before</SelectItem>
              <SelectItem value="24">24 hours before</SelectItem>
              <SelectItem value="48">2 days before</SelectItem>
              <SelectItem value="72">3 days before</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            How far in advance to send reminder notifications
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reminder-time">Default Reminder Time</Label>
          <Select 
            value={getHourFromTime(reminderTime)} 
            onValueChange={onReminderTimeChange}
            disabled={!emailNotificationsEnabled}
          >
            <SelectTrigger id="reminder-time">
              <SelectValue placeholder="9:00 AM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="06">6:00 AM</SelectItem>
              <SelectItem value="07">7:00 AM</SelectItem>
              <SelectItem value="08">8:00 AM</SelectItem>
              <SelectItem value="09">9:00 AM</SelectItem>
              <SelectItem value="10">10:00 AM</SelectItem>
              <SelectItem value="12">12:00 PM</SelectItem>
              <SelectItem value="14">2:00 PM</SelectItem>
              <SelectItem value="16">4:00 PM</SelectItem>
              <SelectItem value="18">6:00 PM</SelectItem>
              <SelectItem value="20">8:00 PM</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Time of day when reminders will be sent by default
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationTimingOptions;
