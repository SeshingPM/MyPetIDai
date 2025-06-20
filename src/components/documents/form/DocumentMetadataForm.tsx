
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CategorySelector from '../CategorySelector';
import PetSelector from './PetSelector';

interface DocumentMetadataFormProps {
  documentName: string;
  setDocumentName: (name: string) => void;
  category: string;
  setCategory: (category: string) => void;
  isUploading: boolean;
  file: File | null;
  petId?: string;
  onPetChange?: (petId: string | undefined) => void;
}

const DocumentMetadataForm: React.FC<DocumentMetadataFormProps> = ({
  documentName,
  setDocumentName,
  category,
  setCategory,
  isUploading,
  file,
  petId,
  onPetChange
}) => {
  // Auto-populate name when a scanned file is set
  useEffect(() => {
    if (file && file.name.startsWith('document-scan-') && !documentName) {
      setDocumentName('Scanned Document');
      if (!category) {
        setCategory('Other');
      }
    }
  }, [file, documentName, category, setDocumentName, setCategory]);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="document-name">Document Name</Label>
        <Input
          id="document-name"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder="e.g. Vaccination Certificate"
          disabled={isUploading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <CategorySelector
          value={category}
          onChange={setCategory}
          disabled={isUploading}
        />
      </div>
      
      {/* Pet selector (only displayed if onPetChange handler is provided) */}
      {onPetChange && (
        <PetSelector
          selectedPetId={petId}
          onSelectPet={onPetChange}
          disabled={isUploading}
        />
      )}
    </>
  );
};

export default DocumentMetadataForm;
