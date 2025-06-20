
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UseDocumentFormProps {
  petId?: string;
  setIsUploading: (isUploading: boolean) => void;
  onSuccess: () => void;
}

export const useDocumentForm = ({ petId, setIsUploading, onSuccess }: UseDocumentFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Update document name from filename when a file is selected
  useEffect(() => {
    if (file && !documentName) {
      const fileName = file.name.split('.').slice(0, -1).join('.');
      setDocumentName(fileName);
    }
  }, [file, documentName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log(`[DocumentForm] File selected: ${selectedFile.name} (${selectedFile.type}, ${selectedFile.size} bytes)`);
      
      // Validate file size
      if (selectedFile.size > 15 * 1024 * 1024) {
        toast.error("File is too large. Maximum size is 15MB.");
        return;
      }
      
      setFile(selectedFile);
      
      // Auto-fill the document name with the file name (without extension)
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      setDocumentName(fileName);
      
      // Clear any previous errors
      setUploadError(null);
    }
  };

  const isFormValid = !!file && !!documentName && !!category;

  return {
    file,
    setFile,
    documentName,
    setDocumentName,
    category,
    setCategory,
    uploadError,
    handleFileChange,
    isFormValid
  };
};
