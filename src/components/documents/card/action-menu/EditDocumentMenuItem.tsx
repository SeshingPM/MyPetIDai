import React, { useState } from 'react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Edit } from 'lucide-react';
import { Document } from '@/utils/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditDocumentForm, { DocumentFormValues } from '@/components/documents/edit/EditDocumentForm';
import { updateDocument } from '@/utils/document-api/update';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

/**
 * A completely self-contained Edit MenuItem that handles the entire editing flow
 * without relying on parent components
 */
export const EditDocumentMenuItem: React.FC<{
  document: Document;
  onSuccess?: () => void;
  /**
   * If true, this component will handle showing success messages.
   * If false or undefined, parent components are expected to handle success messages.
   */
  showSuccessToast?: boolean;
}> = ({ document, onSuccess, showSuccessToast = false }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  console.log('Rendering EditDocumentMenuItem for document:', document.id);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('EditDocumentMenuItem: Edit button clicked for document:', document.id);
    setOpen(true);
  };
  
  const handleSubmit = async (formData: DocumentFormValues & { id: string }) => {
    console.log('EditDocumentMenuItem: Submitting form with data:', formData);
    
    try {
      setIsSubmitting(true);
      
      const { id, ...updates } = formData;
      
      // Process updates to handle special values
      const processedUpdates = {
        ...updates,
        petId: updates.petId === 'none' ? null : updates.petId
      };
      
      const success = await updateDocument(id, processedUpdates);
      
      if (success) {
        // Close the dialog first to prevent any reopening issues
        setOpen(false);
        
        // Only show success toast if explicitly requested via the showSuccessToast prop
        // This prevents duplicate toasts when parent components also show success messages
        if (showSuccessToast) {
          toast.success('Document updated successfully!');
        }
        
        // Update the dashboard cache directly for immediate visual feedback
        queryClient.setQueryData(['dashboardRealDocuments'], (oldData: Document[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(doc => {
            if (doc.id === id) {
              // Return updated document with all properties preserved
              return {
                ...doc,
                name: formData.name,
                category: formData.category,
                petId: formData.petId === 'none' ? null : formData.petId
              };
            }
            return doc;
          });
        });
        
        // Invalidate queries with a slight delay to ensure everything stays in sync
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['dashboardRealDocuments'] });
        }, 100);
        
        // Call the onSuccess callback - let the parent component handle the success message
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 50);
        }
      } else {
        toast.error('Failed to update document');
      }
    } catch (error) {
      console.error('EditDocumentMenuItem: Error updating document:', error);
      toast.error('An error occurred while updating the document');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <DropdownMenuItem onClick={handleClick}>
        <Edit className="h-4 w-4 mr-2" />
        <span>Edit</span>
      </DropdownMenuItem>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          <EditDocumentForm 
            document={document}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditDocumentMenuItem;
