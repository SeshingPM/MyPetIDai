
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type HealthRecord } from '@/contexts/health';
import { format } from 'date-fns';
import { Trash2, Edit, PlusCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import MedicationList from '../medications/MedicationList';

interface HealthRecordCardProps {
  record: HealthRecord;
  petName: string;
  medications: any[];
  onEdit: (record: HealthRecord) => void;
  onDelete: (id: string) => void;
  onAddMedication: (record: HealthRecord) => void;
}

const HealthRecordCard: React.FC<HealthRecordCardProps> = ({
  record,
  petName,
  medications,
  onEdit,
  onDelete,
  onAddMedication
}) => {
  // Helper function to convert kg to lbs
  const kgToLbs = (kg: number): string => {
    return (kg * 2.20462).toFixed(2);
  };

  return (
    <Card key={record.id} className="overflow-hidden">
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Health Record: {format(new Date(record.recordDate), 'MMM d, yyyy')}
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(record)}
            >
              <Edit size={16} className="mr-1" />
              Edit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this health record and all associated medications.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(record.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {record.weight && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Weight</h4>
                <p className="text-lg">{kgToLbs(record.weight)} lbs</p>
              </div>
            )}
            
            {record.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                <p className="text-sm">{record.notes}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Medications</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAddMedication(record)}
            >
              <PlusCircle size={16} className="mr-1" />
              Add Medication
            </Button>
          </div>
          
          {medications.length > 0 ? (
            <MedicationList medications={medications} />
          ) : (
            <p className="text-sm text-gray-500">No medications added yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthRecordCard;
