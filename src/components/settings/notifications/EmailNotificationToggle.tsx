
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface EmailNotificationToggleProps {
  enabled: boolean;
  onToggle: (checked: boolean) => Promise<void>;
}

const EmailNotificationToggle: React.FC<EmailNotificationToggleProps> = ({ 
  enabled, 
  onToggle 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3">
        <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
        <div>
          <Label htmlFor="email-notifications" className="font-medium">
            Email Notifications
          </Label>
          <p className="text-sm text-muted-foreground">
            Receive reminders via email
          </p>
        </div>
      </div>
      <Switch
        id="email-notifications"
        checked={enabled}
        onCheckedChange={onToggle}
      />
    </div>
  );
};

export default EmailNotificationToggle;
