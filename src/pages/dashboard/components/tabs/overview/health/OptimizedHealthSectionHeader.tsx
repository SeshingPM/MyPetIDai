
import React, { memo } from 'react';
import { Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

interface OptimizedHealthSectionHeaderProps {
  healthStatus: 'good' | 'fair' | 'needs-attention' | 'neutral';
}

// Status components optimized and memoized
const GoodStatus = memo(() => (
  <div className="flex items-center gap-2">
    <ShieldCheck className="h-5 w-5 text-green-500" />
    <span className="font-medium text-green-600">Good</span>
  </div>
));

const FairStatus = memo(() => (
  <div className="flex items-center gap-2">
    <Activity className="h-5 w-5 text-amber-500" />
    <span className="font-medium text-amber-600">Fair</span>
  </div>
));

const NeedsAttentionStatus = memo(() => (
  <div className="flex items-center gap-2">
    <AlertTriangle className="h-5 w-5 text-red-500" />
    <span className="font-medium text-red-600">Needs Attention</span>
  </div>
));

const NeutralStatus = memo(() => (
  <div className="flex items-center gap-2">
    <Activity className="h-5 w-5 text-gray-500" />
    <span className="font-medium text-gray-600">No Data</span>
  </div>
));

const OptimizedHealthSectionHeader: React.FC<OptimizedHealthSectionHeaderProps> = ({ healthStatus }) => {
  return (
    <div className="flex justify-between items-center pb-2">
      <div>
        <h3 className="text-lg font-medium">Pet Health</h3>
        <p className="text-sm text-gray-500">Track vaccinations and health records</p>
      </div>
      
      {/* Status indicator */}
      {healthStatus === 'good' && <GoodStatus />}
      {healthStatus === 'fair' && <FairStatus />}
      {healthStatus === 'needs-attention' && <NeedsAttentionStatus />}
      {healthStatus === 'neutral' && <NeutralStatus />}
    </div>
  );
};

export default memo(OptimizedHealthSectionHeader);
