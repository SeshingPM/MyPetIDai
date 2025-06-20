
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const AdminSettings = () => {
  const handleCacheClear = () => {
    // Mock implementation - in a real app this would clear server caches
    setTimeout(() => {
      toast.success('System cache cleared successfully');
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">System Settings</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>
                Manage system cache and other maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Clear System Cache</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear all cached data to ensure the latest information is displayed
                  </p>
                </div>
                <Button variant="outline" onClick={handleCacheClear}>
                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-alerts">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send system alert notifications via email
                  </p>
                </div>
                <Switch id="email-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="system-maintenance">Maintenance Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify users about scheduled maintenance
                  </p>
                </div>
                <Switch id="system-maintenance" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
