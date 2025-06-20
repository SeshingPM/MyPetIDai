
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, PawPrint } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatsLoadingSkeleton } from '@/components/admin/StatsLoadingSkeleton';
import { fetchAdminStats, Activity } from '@/services/admin/adminStatsService';
import { EnhancedStatCard } from '@/components/admin/stats/EnhancedStatCard';
import { StatsHeader } from '@/components/admin/stats/StatsHeader';
import { ActivityOverview } from '@/components/admin/activity/ActivityOverview';
import { QuickActions } from '@/components/admin/actions/QuickActions';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { LineChart } from '@/components/ui/chart';

const AdminDashboard = () => {
  const [period, setPeriod] = useState('7d');
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-stats', period],
    queryFn: () => fetchAdminStats(period)
  });

  // Calculate trend percentages based on data
  const calculateTrend = (current: number, recent: number) => {
    if (recent === 0) return { value: 0, isPositive: true };
    const trend = ((current - recent) / recent) * 100;
    return {
      value: Math.abs(Math.round(trend)),
      isPositive: trend >= 0
    };
  };
  
  // Use users trend as recent signups / total users
  const usersTrend = stats ? 
    calculateTrend(stats.recent_signups, stats.total_users - stats.recent_signups) : 
    { value: 0, isPositive: true };

  // User engagement metrics (replacing subscription metrics since product is now free)
  const activeUsersTotal = stats ? stats.user_engagement.active_users : 0;
  const returningUsersTotal = stats ? stats.user_engagement.returning_users : 0;
  const userEngagementTrend = { value: 12, isPositive: true };

  // Pets trend (simplified)
  const petsTrend = { value: 8, isPositive: true };

  // Sample chart data for dialogs
  const usersChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'User Growth',
        data: [65, 78, 90, 105, 125, 138],
        borderColor: '#2563eb',
      },
    ],
  };
  
  const userEngagementChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Active Users',
        data: [28, 35, 42, 50, 55, 62],
        borderColor: '#16a34a',
      },
    ],
  };
  
  const petsChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Registered Pets',
        data: [85, 102, 120, 145, 170, 195],
        borderColor: '#9333ea',
      },
    ],
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <StatsLoadingSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load dashboard data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  // Ensure recent_activities is always an array
  const activities = stats?.recent_activities || [];

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="p-6 space-y-6">
          <StatsHeader onPeriodChange={setPeriod} />
          
          <div className="grid gap-6 md:grid-cols-3">
            <EnhancedStatCard 
              title="Total Users" 
              value={stats?.total_users || 0}
              icon={Users}
              iconColor="text-blue-500"
              trend={usersTrend}
              tooltipContent="Active registered users in the system"
              detailedInfo="This shows the total number of registered users in the system. New user growth is calculated from registrations in the last period."
              chartData={<LineChart data={usersChartData} />}
            />
            <EnhancedStatCard 
              title="Active Users" 
              value={activeUsersTotal}
              icon={TrendingUp}
              iconColor="text-green-500"
              trend={userEngagementTrend}
              tooltipContent="Users who have created at least one pet profile"
              detailedInfo={`Users who are actively using the platform: ${activeUsersTotal} active users, with ${returningUsersTotal} returning users. This represents our growing free user base.`}
              chartData={<LineChart data={userEngagementChartData} />}
            />
            <EnhancedStatCard 
              title="Total Pets" 
              value={stats?.total_pets || 0}
              icon={PawPrint}
              iconColor="text-purple-500"
              trend={petsTrend}
              tooltipContent="Total pets registered in the platform"
              detailedInfo="The total number of pets registered in the platform across all users. On average, each user registers 1.5 pets."
              chartData={<LineChart data={petsChartData} />}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <QuickActions />
            <ActivityOverview activities={activities} />
          </div>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
};

export default AdminDashboard;
