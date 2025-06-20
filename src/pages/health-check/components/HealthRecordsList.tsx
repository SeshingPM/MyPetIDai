
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type HealthRecord } from '@/contexts/health';
import { toast } from 'sonner';
import { useHealth } from '@/contexts/health';
import AddMedicationDialog from './medications/AddMedicationDialog';
import HealthRecordCard from './records/HealthRecordCard';
import EditHealthRecordDialog from './records/EditHealthRecordDialog';

interface HealthRecordsListProps {
  records: HealthRecord[];
  petId: string;
  petName: string;
}

const HealthRecordsList: React.FC<HealthRecordsListProps> = ({ records, petId, petName }) => {
  const { deleteHealthRecord, getMedicationsForPet } = useHealth();
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isAddMedicationDialogOpen, setIsAddMedicationDialogOpen] = useState(false);
  const [isEditRecordDialogOpen, setIsEditRecordDialogOpen] = useState(false);
  
  const handleDeleteRecord = async (id: string) => {
    try {
      const success = await deleteHealthRecord(id);
      if (success) {
        toast.success('Health record deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting health record:', error);
      toast.error('Failed to delete health record');
    }
  };
  
  const handleEditRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setIsEditRecordDialogOpen(true);
  };
  
  const handleAddMedication = (record: HealthRecord) => {
    setSelectedRecord(record);
    setIsAddMedicationDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      {records.map((record) => {
        const medications = getMedicationsForPet(petId).filter(
          med => med.healthRecordId === record.id
        );
        
        return (
          <HealthRecordCard
            key={record.id}
            record={record}
            petName={petName}
            medications={medications}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
            onAddMedication={handleAddMedication}
          />
        );
      })}
      
      {selectedRecord && (
        <>
          <AddMedicationDialog
            open={isAddMedicationDialogOpen}
            onOpenChange={setIsAddMedicationDialogOpen}
            petId={petId}
            petName={petName}
            healthRecordId={selectedRecord.id}
          />
          
          <EditHealthRecordDialog
            open={isEditRecordDialogOpen}
            onOpenChange={setIsEditRecordDialogOpen}
            record={selectedRecord}
            petName={petName}
          />
        </>
      )}
    </div>
  );
};

export default HealthRecordsList;
