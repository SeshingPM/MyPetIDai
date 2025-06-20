
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart } from '@/components/ui/chart';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const AdminReports = () => {
  const [period, setPeriod] = useState('7d');
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-stats', period],
    queryFn: async () => {
      try {
        const { data: statsData, error: statsError } = await supabase.functions.invoke('admin-stats', {
          method: 'POST',
          body: { period }
        });
        
        if (statsError) {
          console.error('Admin stats error:', statsError);
          toast.error('Failed to load dashboard stats');
          throw new Error('Failed to load dashboard stats');
        }
        
        return statsData;
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast.error('Error loading stats data');
        throw error;
      }
    }
  });

  // Sample data for charts
  const usersData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'New Users',
        data: [3, 5, 2, 6, 4, 7, 5],
        backgroundColor: '#2563eb',
      },
    ],
  };

  const activitiesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'User Activities',
        data: [12, 19, 15, 22, 35, 27, 30],
        borderColor: '#16a34a',
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics Reports</h1>
          
          <div className="mt-4 md:mt-0">
            <select 
              className="bg-background border rounded-md px-3 py-1"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart data={usersData} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Daily active users on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart data={activitiesData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>Analysis of user demographics and behaviors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] flex items-center justify-center border rounded-md bg-muted/5">
                  <p className="text-muted-foreground">Detailed demographics will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Engagement</CardTitle>
                <CardDescription>How users interact with platform content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] flex items-center justify-center border rounded-md bg-muted/5">
                  <p className="text-muted-foreground">Content engagement metrics will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <Button variant="outline">Download Reports</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
