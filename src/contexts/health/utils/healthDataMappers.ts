
import { HealthRecord, Medication, Vaccination, MedicalEvent } from '@/utils/types';

// Maps raw health records from the database to our application's type structure
export const mapHealthRecords = (data: any[]): HealthRecord[] => {
  return data.map(item => ({
    id: item.id,
    petId: item.pet_id,
    userId: item.user_id,
    recordDate: item.record_date,
    weight: item.weight,
    notes: item.notes,
    createdAt: item.created_at,
  }));
};

// Maps raw medications from the database to our application's type structure
export const mapMedications = (data: any[]): Medication[] => {
  return data.map(item => ({
    id: item.id,
    healthRecordId: item.health_record_id,
    petId: item.pet_id,
    userId: item.user_id,
    name: item.name,
    dosage: item.dosage,
    frequency: item.frequency,
    startDate: item.start_date,
    endDate: item.end_date,
    notes: item.notes,
    createdAt: item.created_at,
  }));
};

// Maps raw vaccinations from the database to our application's type structure
export const mapVaccinations = (data: any[]): Vaccination[] => {
  return data.map(item => ({
    id: item.id,
    petId: item.pet_id,
    userId: item.user_id,
    name: item.name,
    dateAdministered: item.date_administered,
    expirationDate: item.expiration_date,
    administrator: item.administrator,
    batchNumber: item.batch_number,
    notes: item.notes,
    createdAt: item.created_at,
  }));
};

// Maps raw medical events from the database to our application's type structure
export const mapMedicalEvents = (data: any[]): MedicalEvent[] => {
  return data.map(item => ({
    id: item.id,
    petId: item.pet_id,
    userId: item.user_id,
    eventDate: item.event_date,
    eventType: item.event_type,
    title: item.title,
    description: item.description,
    provider: item.provider,
    cost: item.cost,
    createdAt: item.created_at,
  }));
};
