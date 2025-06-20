
import React from 'react';
import { Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

interface HealthSectionHeaderProps {
  healthStatus: 'good' | 'fair' | 'needs-attention' | 'neutral';
}

const HealthSectionHeader: React.FC<HealthSectionHeaderProps> = ({ healthStatus }) => {
  // Helper for rendering status icon
  const renderStatusIcon = () => {
    switch (healthStatus) {
      case 'good':
        return <ShieldCheck className="h-8 w-8 text-green-500" />;
      case 'fair':
        return <Activity className="h-8 w-8 text-amber-500" />;
      case 'needs-attention':
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
      default:
        return <Activity className="h-8 w-8 text-gray-400" />;
    }
  };
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">Health Status</h3>
        <p className="text-xs text-gray-500">Pet health records and vaccinations</p>
      </div>
      {renderStatusIcon()}
    </div>
  );
};

export default HealthSectionHeader;
