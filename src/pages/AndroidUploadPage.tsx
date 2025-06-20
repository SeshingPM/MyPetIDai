import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FileUp, X, ArrowLeft, HelpCircle } from 'lucide-react';
import { usePets } from '@/contexts/pets';
import { useDocumentUpload } from '@/components/documents/form/hooks/useDocumentUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';
import RequireAuth from '@/components/auth/RequireAuth';
import logger from '@/utils/logger';
import { DOCUMENT_CATEGORIES } from '@/utils/types';

// Convert DOCUMENT_CATEGORIES from utils/types to the format needed for SelectItem
const UPLOAD_CATEGORIES = DOCUMENT_CATEGORIES
  .filter(category => category !== 'All Categories' && category !== 'Favorites') // Remove filter-only categories
  .map(category => ({
    id: category.toLowerCase().replace(/\s+/g, '_'),
    name: category
  }));

const AndroidUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { uploadDocument } = useDocumentUpload();
  
  // State
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState('');
  const [petId, setPetId] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Get pets from context
  const { pets = [] } = usePets();
  
  // Form validation
  const isFormValid = file && documentName && category;
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      logger.info(`[AndroidUpload] File selected: ${selectedFile.name} (${selectedFile.size} bytes)`);
      setFile(selectedFile);
      
      // Auto-populate document name based on file name
      if (!documentName) {
        const baseName = selectedFile.name.split('.')[0];
        const formattedName = baseName
          .replace(/[_-]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        setDocumentName(formattedName);
      }
    }
  };
  
  // Handle form submission
  const handleUpload = async () => {
    if (!isFormValid) {
      setErrorMessage('Please fill in all fields and select a file');
      return;
    }
    
    if (isUploading) {
      return;
    }
    
    setIsUploading(true);
    setErrorMessage('');
    
    try {
      logger.info('[AndroidUpload] Starting upload');
      toast.loading('Uploading document...', { id: 'android-upload' });
      
      // Pre-invalidate queries
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      
      // Clone file for more reliable upload
      let fileToUpload: File;
      try {
        const arrayBuffer = await file!.arrayBuffer();
        fileToUpload = new File([arrayBuffer], file!.name, { type: file!.type });
        if (fileToUpload.size === 0 && file!.size > 0) {
          logger.warn('[AndroidUpload] File clone failed, using original');
          fileToUpload = file!;
        }
      } catch (err) {
        logger.warn('[AndroidUpload] Error cloning file, using original', err);
        fileToUpload = file!;
      }
      
      // Upload the document
      const result = await uploadDocument({
        file: fileToUpload,
        documentName,
        category,
        petId // Include selected pet ID
      });
      
      logger.info('[AndroidUpload] Upload successful');
      toast.dismiss('android-upload');
      toast.success('Document uploaded successfully');
      
      // Redirect to documents page after a short delay
      setTimeout(() => {
        navigate('/documents');
      }, 1000);
    } catch (error) {
      logger.error('[AndroidUpload] Upload failed:', error);
      toast.dismiss('android-upload');
      toast.error('Upload failed. Please try again.');
      setErrorMessage('There was a problem uploading your document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          type="button"
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/documents')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
        
        <h1 className="text-2xl font-bold">Upload Document</h1>
        <p className="text-gray-500">Add a new document to your records</p>
      </div>
      
      <form 
        className="space-y-6" 
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid && !isUploading) {
            handleUpload();
          }
        }}
      >
        {/* File Selection */}
        <div className="border-2 border-dashed rounded-lg p-4">
          {file ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg mr-3">
                  <FileUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setFile(null)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="android-upload-form">
              <div
                onClick={() => document.getElementById('file-upload')?.click()}
                className="cursor-pointer p-4 text-center"
                role="button"
                tabIndex={0}
              >
                <FileUp className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-500 mb-2">Click to select a file or scan document</p>
                <p className="text-xs text-gray-400">PDF, JPG, PNG, DOC, DOCX</p>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    e.preventDefault(); // Prevent form submission
                    handleFileChange(e);
                  }}
                  accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf,.doc,.docx"
                  disabled={isUploading}
                />
              </div>
            </form>
          )}
        </div>
        
        {/* Document Name */}
        <div>
          <label htmlFor="document-name" className="block text-sm font-medium mb-2">
            Document Name
          </label>
          <Input
            id="document-name"
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="Enter document name"
            disabled={isUploading}
          />
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category
          </label>
          <Select
            value={category}
            onValueChange={setCategory}
            disabled={isUploading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {UPLOAD_CATEGORIES.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Pet selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="pet-select" className="block text-sm font-medium">
              Assign to Pet
            </label>
            {pets.length === 0 && (
              <div className="flex items-center text-gray-500 text-xs">
                <HelpCircle className="h-3 w-3 mr-1" />
                <span>Add a pet in profile</span>
              </div>
            )}
          </div>
          <Select
            value={petId || "none"}
            onValueChange={(value) => setPetId(value === "none" ? undefined : value)}
            disabled={isUploading || pets.length === 0}
          >
            <SelectTrigger id="pet-select">
              <SelectValue placeholder={pets.length > 0 ? "Select a pet" : "No pets available"} />
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
        
        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-sm">
            {errorMessage}
          </div>
        )}
        
        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={!isFormValid || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </form>
    </div>
  );
};

// Wrap with auth protection
const ProtectedAndroidUploadPage: React.FC = () => (
  <RequireAuth>
    <AndroidUploadPage />
  </RequireAuth>
);

export default ProtectedAndroidUploadPage;
