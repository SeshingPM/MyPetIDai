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

/**
 * iOS-specific upload page with optimized UI for iOS devices
 */
const IOSUploadPage: React.FC = () => {
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
      logger.info(`[IOSUpload] File selected: ${selectedFile.name} (${selectedFile.size} bytes)`);
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
      logger.info('[IOSUpload] Starting upload');
      toast.loading('Uploading document...', { id: 'ios-upload' });
      
      // Pre-invalidate queries
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      
      // Clone file for more reliable upload
      let fileToUpload: File;
      try {
        const arrayBuffer = await file!.arrayBuffer();
        fileToUpload = new File([arrayBuffer], file!.name, { type: file!.type });
        if (fileToUpload.size === 0 && file!.size > 0) {
          logger.warn('[IOSUpload] File clone failed, using original');
          fileToUpload = file!;
        }
      } catch (err) {
        logger.warn('[IOSUpload] Error cloning file, using original', err);
        fileToUpload = file!;
      }
      
      // Upload the document
      const result = await uploadDocument({
        file: fileToUpload,
        documentName,
        category,
        petId // Include selected pet ID (if any)
      });
      
      logger.info('[IOSUpload] Upload successful');
      toast.dismiss('ios-upload');
      toast.success('Document uploaded successfully');
      
      // Redirect to documents page after a short delay
      setTimeout(() => {
        navigate('/documents');
      }, 1000);
    } catch (error) {
      logger.error('[IOSUpload] Upload failed:', error);
      toast.dismiss('ios-upload');
      toast.error('Upload failed. Please try again.');
      setErrorMessage('There was a problem uploading your document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white ios-upload-page">
      {/* Header Bar */}
      <div className="sticky top-0 z-10 bg-white border-b p-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/documents')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Upload Document</h1>
      </div>
      
      {/* Form */}
      <form 
        className="p-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid && !isUploading) {
            handleUpload();
          }
        }}
      >
        {/* File Selection - iOS optimized */}
        <div className="border-2 border-dashed rounded-lg p-4 ios-touch-target">
          {file ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg mr-3">
                  <FileUp className="h-6 w-6 text-primary" />
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
                className="ios-touch-target"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ) : (
            <div
              onClick={() => document.getElementById('ios-file-upload')?.click()}
              className="cursor-pointer p-5 text-center"
              role="button"
              tabIndex={0}
            >
              <FileUp className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-500 mb-2">Click to select a file or scan a document</p>
              <p className="text-xs text-gray-400">PDF, JPG, PNG, DOC, DOCX</p>
              <input
                id="ios-file-upload"
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
          )}
        </div>
        
        {/* Document Name - iOS optimized */}
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
            className="ios-input-height"
          />
        </div>
        
        {/* Category - iOS optimized */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category
          </label>
          <Select
            value={category}
            onValueChange={setCategory}
            disabled={isUploading}
          >
            <SelectTrigger className="ios-input-height">
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
        
        {/* Pet selector - iOS optimized */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label htmlFor="pet-selection" className="block text-sm font-medium">
              Assign to Pet
            </label>
            {pets.length === 0 && (
              <div className="flex items-center text-gray-500 text-xs">
                <HelpCircle className="h-3 w-3 mr-1" />
                <span>Add a pet to assign documents</span>
              </div>
            )}
          </div>
          <Select
            value={petId || "none"}
            onValueChange={(value) => setPetId(value === "none" ? undefined : value)}
            disabled={isUploading || pets.length === 0}
          >
            <SelectTrigger className="ios-input-height" id="pet-selection">
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
        
        {/* Submit Button - iOS optimized */}
        <Button
          type="submit"
          className="w-full ios-touch-target py-3 text-base"
          disabled={!isFormValid || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </form>
    </div>
  );
};

// Wrap with auth protection
const ProtectedIOSUploadPage: React.FC = () => (
  <RequireAuth>
    <IOSUploadPage />
  </RequireAuth>
);

export default ProtectedIOSUploadPage;
