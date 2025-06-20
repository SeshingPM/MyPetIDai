
import React from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Plus } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';

interface NoRecordsStateProps {
  petName: string;
  onAddRecord: () => void;
}

const NoRecordsState: React.FC<NoRecordsStateProps> = ({ petName, onAddRecord }) => {
  return (
    <GlassCard className="text-center py-16 px-4">
      <Activity size={48} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-600 mb-2">No health records yet</h3>
      <p className="text-gray-500 mb-6">
        Start tracking {petName}'s health by adding your first health record
      </p>
      <Button 
        onClick={onAddRecord} 
        className="btn-primary"
      >
        <Plus size={16} className="mr-2" />
        Add First Health Record
      </Button>
    </GlassCard>
  );
};

export default NoRecordsState;
