
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import HealthRecordsList from '../HealthRecordsList';
import NoRecordsState from '../NoRecordsState';
import { HealthRecord } from '@/utils/types';

interface RecordsTabContentProps {
  petId: string;
  petName: string;
  healthRecords: HealthRecord[];
  onAddRecord: () => void;
  isLoading?: boolean;
}

const RecordsTabContent: React.FC<RecordsTabContentProps> = ({ 
  petId, 
  petName, 
  healthRecords, 
  onAddRecord,
  isLoading = false
}) => {
  return (
    <div className="animate-in fade-in-50">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <h3 className="text-lg font-medium">Health Records</h3>
        <Button 
          onClick={onAddRecord} 
          className="btn-primary w-full sm:w-auto"
          size="sm"
          aria-label="Add Health Record"
          disabled={isLoading}
        >
          <Plus size={16} className="mr-2" />
          Add Health Record
        </Button>
      </div>
      
      {isLoading ? (
        <div className="py-8 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground">Loading records...</p>
          </div>
        </div>
      ) : healthRecords.length > 0 ? (
        <HealthRecordsList 
          records={healthRecords} 
          petId={petId}
          petName={petName}
        />
      ) : (
        <NoRecordsState 
          petName={petName}
          onAddRecord={onAddRecord}
        />
      )}
    </div>
  );
};

export default RecordsTabContent;
