
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, TrendingUp, Info, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-20 text-left"
          onClick={() => navigate('/admin/users')}
        >
          <Users className="h-5 w-5" />
          <div>
            <div className="font-semibold">User Management</div>
            <div className="text-xs text-muted-foreground">View and manage users</div>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-20 text-left"
          onClick={() => navigate('/admin/settings')}
        >
          <Settings className="h-5 w-5" />
          <div>
            <div className="font-semibold">System Settings</div>
            <div className="text-xs text-muted-foreground">Configure platform settings</div>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-20 text-left"
          onClick={() => navigate('/admin/reports')}
        >
          <TrendingUp className="h-5 w-5" />
          <div>
            <div className="font-semibold">Analytics</div>
            <div className="text-xs text-muted-foreground">View detailed reports</div>
          </div>
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-20 text-left"
          onClick={() => navigate('/admin/system-status')}
        >
          <Info className="h-5 w-5" />
          <div>
            <div className="font-semibold">System Health</div>
            <div className="text-xs text-muted-foreground">Monitor platform status</div>
          </div>
        </Button>
        {/* Promo Codes button removed - all features are now free */}
      </CardContent>
    </Card>
  );
};
