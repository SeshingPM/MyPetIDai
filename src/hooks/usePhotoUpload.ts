
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UsePhotoUploadProps {
  petId: string;
  onSuccess: (uploadedPhotos: any) => void;
}

export const usePhotoUpload = ({ petId, onSuccess }: UsePhotoUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const newFiles = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleCameraCapture = () => {
    setShowCamera(true);
  };

  const handleCapturedImage = (file: File) => {
    setSelectedFiles(prev => [...prev, file]);
    setShowCamera(false);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Also remove the caption if it exists
    const updatedCaptions = { ...captions };
    delete updatedCaptions[index.toString()];
    setCaptions(updatedCaptions);
  };

  const handleCaptionChange = (index: number, value: string) => {
    setCaptions(prev => ({
      ...prev,
      [index.toString()]: value
    }));
  };

  const uploadPhotos = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one photo to upload.");
      return false;
    }
    
    setIsUploading(true);
    console.log('Starting upload process');
    
    try {
      // Get the authenticated user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Auth error:', userError);
        throw userError;
      }
      
      if (!userData.user) {
        toast.error("You must be logged in to upload photos");
        return false;
      }

      console.log('User authenticated:', userData.user.id);
      const uploadedPhotos = [];
      
      // Upload each file to Supabase storage
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const caption = captions[i.toString()] || '';
        
        // Create unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${petId}/${Date.now()}-${i}.${fileExt}`;
        
        console.log(`Uploading file ${i+1}/${selectedFiles.length}: ${fileName}`);
        
        // Upload to Supabase
        const { error: uploadError, data } = await supabase.storage
          .from('pet-photos')
          .upload(fileName, file);
          
        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }
        
        console.log('File uploaded successfully:', data?.path);
        
        // Get a signed URL for the file (since bucket is private)
        const { data: urlData } = await supabase.storage
          .from('pet-photos')
          .createSignedUrl(fileName, 60 * 60 * 24); // 1 day expiry
          
        if (!urlData || !urlData.signedUrl) {
          throw new Error('Failed to create signed URL');
        }
        
        console.log('Signed URL:', urlData.signedUrl);
        
        // Store photo data in the photos table
        const { error: insertError, data: insertData } = await supabase
          .from('photos')
          .insert({
            user_id: userData.user.id,
            pet_id: petId,
            url: urlData.signedUrl,
            caption: caption || null
          })
          .select();
          
        if (insertError) {
          console.error('DB insert error:', insertError);
          throw insertError;
        }
        
        console.log('Photo record created:', insertData);
        
        uploadedPhotos.push({
          url: urlData.signedUrl,
          caption,
          petId
        });
      }
      
      console.log('All photos uploaded successfully');
      toast.success(`${uploadedPhotos.length} photo${uploadedPhotos.length !== 1 ? 's' : ''} uploaded successfully`);
      onSuccess(uploadedPhotos);
      return true;
      
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error("There was a problem uploading your photos. Please try again.");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await uploadPhotos();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files?.length) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        file => file.type.startsWith('image/')
      );
      
      if (newFiles.length) {
        setSelectedFiles(prev => [...prev, ...newFiles]);
      } else {
        toast.error("Please drop only image files.");
      }
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return {
    selectedFiles,
    isUploading,
    captions,
    showCamera,
    fileInputRef,
    handleFileChange,
    handleCameraCapture,
    handleCapturedImage,
    handleRemoveFile,
    handleCaptionChange,
    handleSubmit,
    handleDragOver,
    handleDrop,
    handleFileSelect,
    setShowCamera
  };
};
