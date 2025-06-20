// Document interface type
export interface Document {
  id: string;
  name: string;
  fileUrl: string;
  fileType: string | null;
  category: string;
  createdAt: string;
  userId: string;
  petId?: string; // Ensure petId is explicitly defined
  petName?: string; // Optional pet name for display purposes
  shareUrl?: string;
  shareExpiry?: Date | null;
  uploadDate?: Date; // Added for compatibility with old code
  isFavorite?: boolean; // New property for favorites
  archived?: boolean; // Add archived property for document archiving functionality
}

// Document categories for filtering
export const DOCUMENT_CATEGORIES = [
  "All Categories",
  "Bookmarks", // Changed from 'Favorites' to 'Bookmarks' for consistency
  "Vaccination Record",
  "Medical Report",
  "Insurance Policy",
  "Adoption Certificate",
  "Training Certificate",
  "Microchip Information",
  "Prescription",
  "Other",
];

// Health record types
export interface HealthRecord {
  id: string;
  petId: string;
  userId: string;
  recordDate: string;
  weight?: number;
  notes?: string;
  createdAt: string;
  medications?: Medication[];
}

export interface Medication {
  id: string;
  healthRecordId?: string;
  petId: string;
  userId: string;
  name: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
}

// Vaccination types
export interface Vaccination {
  id: string;
  petId: string;
  userId: string;
  name: string;
  dateAdministered: string;
  expirationDate?: string;
  administrator?: string; // Vet or clinic that administered
  batchNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface MedicalEvent {
  id: string;
  petId: string;
  userId: string;
  eventDate: string;
  eventType: string; // Updated to be a string instead of enum to allow custom types
  title: string;
  description?: string;
  provider?: string; // Vet or clinic
  cost?: number;
  createdAt: string;
}

export interface NewHealthRecordData {
  petId: string;
  weight?: number;
  notes?: string;
  recordDate?: string;
  medications?: NewMedicationData[];
}

export interface NewMedicationData {
  name: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  healthRecordId?: string;
}

export interface NewVaccinationData {
  petId: string;
  name: string;
  dateAdministered: string;
  expirationDate?: string;
  administrator?: string;
  batchNumber?: string;
  notes?: string;
}

export interface NewMedicalEventData {
  petId: string;
  eventDate: string;
  eventType: string; // Updated to be a string instead of enum to allow custom types
  title: string;
  description?: string;
  provider?: string;
  cost?: number;
}
