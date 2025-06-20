
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HealthCheckContent from '@/pages/health-check/HealthCheckContent';
import { HealthProvider } from '@/contexts/health';

const HealthCheck: React.FC = () => {
  return (
    <DashboardLayout>
      <HealthProvider>
        <HealthCheckContent />
      </HealthProvider>
    </DashboardLayout>
  );
};

export default HealthCheck;
