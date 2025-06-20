import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDocumentUpload } from '@/components/documents/form/hooks/useDocumentUpload';
import { Pet } from '@/contexts/pets/types';
import logger from '@/utils/logger';

interface DocumentUploadProps {
  pets: Pet[];
  initialPetId?: string;
  onUploadComplete?: (documentId: string) => void;
  onCancel?: () => void;
  showSkip?: boolean;
  className?: string;
}

/**
 * Reusable document upload component
 */
const DocumentUpload: React.FC<DocumentUploadProps> = ({
  pets,
  initialPetId,
  onUploadComplete,
  onCancel,
  showSkip = false,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState('');
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(initialPetId);
  
  const { uploadDocument } = useDocumentUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check file size (limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File is too large. Please select a file under 10MB.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      setFile(selectedFile);
      
      // Set a default document name based on the file name
      const baseName = selectedFile.name.split('.')[0] || 'Untitled Document';
      setDocumentName(baseName);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    if (!documentName) {
      toast.error('Please provide a document name.');
      return;
    }

    if (!category) {
      toast.error('Please select a document category.');
      return;
    }

    try {
      setIsUploading(true);
      toast.loading('Uploading document...', { id: 'document-upload' });
      
      // Use the document upload function from the hook
      const result = await uploadDocument({
        file,
        documentName,
        category,
        petId: selectedPetId
      });
      
      toast.dismiss('document-upload');
      
      if (result) {
        logger.info('Document uploaded successfully');
        toast.success('Document uploaded successfully!');
        if (onUploadComplete) onUploadComplete(result.id);
      } else {
        throw new Error('Upload failed - no result returned');
      }
    } catch (error) {
      toast.dismiss('document-upload');
      logger.error('Error uploading document:', error);
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Document categories
  const documentCategories = [
    'Vaccination Record',
    'Medical Report',
    'Insurance Policy',
    'Adoption Certificate',
    'Training Certificate',
    'Microchip Information',
    'Prescription',
    'Other'
  ];

  const renderFileUploadSection = () => {
    if (file) {
      return (
        <div className="p-4 border rounded-lg flex items-center space-x-3 mb-4">
          <FileText className="h-6 w-6 text-gray-500" />
          <div className="flex-1 truncate">{file.name}</div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            Change
          </Button>
        </div>
      );
    }

    return (
      <div
        onClick={triggerFileInput}
        className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
      >
        <Upload className="mb-2 h-8 w-8 text-gray-400" />
        <p className="text-sm text-center text-gray-500 mb-1">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-center text-gray-400">
          PDF, JPEG, PNG, or GIF (Max 10MB)
        </p>
      </div>
    );
  };

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Document Name Field */}
      <div className="space-y-2">
        <Label htmlFor="documentName">Document Name</Label>
        <Input
          id="documentName"
          placeholder="e.g. Vaccination Certificate"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          disabled={isUploading}
        />
      </div>
      
      {/* Category Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          value={category} 
          onValueChange={setCategory}
          disabled={isUploading}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {documentCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Pet Selector */}
      <div className="space-y-2">
        <Label htmlFor="pet-select">Assign to Pet</Label>
        <Select 
          value={selectedPetId || "none"} 
          onValueChange={(value) => setSelectedPetId(value === "none" ? undefined : value)}
          disabled={isUploading}
        >
          <SelectTrigger id="pet-select">
            <SelectValue placeholder="Select a pet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">General (No pet)</SelectItem>
            {pets.map(pet => (
              <SelectItem key={pet.id} value={pet.id}>
                {pet.name} {pet.breed ? `(${pet.breed})` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Document File Upload */}
      <div className="space-y-2">
        <Label>Document File</Label>
        {renderFileUploadSection()}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*, application/pdf"
          className="hidden"
          aria-label="Upload document"
        />
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col space-y-2 w-full">
        <Button 
          onClick={handleUpload}
          disabled={isUploading || !file || !documentName || !category}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : 'Upload Document'}
        </Button>
        
        {(showSkip || onCancel) && (
          <Button 
            variant="ghost" 
            onClick={onCancel} 
            disabled={isUploading} 
            className="text-gray-500"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
