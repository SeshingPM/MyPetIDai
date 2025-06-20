import React from 'react';
import { Document } from '@/utils/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EditDocumentForm, { DocumentFormValues } from '@/components/documents/edit/EditDocumentForm';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { updateDocument } from '@/utils/document-api/update';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

/**
 * A completely self-contained component that displays an edit button and handles
 * the entire document editing flow without any dependencies on parent components
 */
const DirectEditButton: React.FC<{
  document: Document;
  mode: 'icon' | 'menu-item';
  onSuccess?: () => void;
}> = ({ document, mode, onSuccess }) => {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const queryClient = useQueryClient();
  
  // Handler for form submission
  const handleSubmit = async (formData: DocumentFormValues & { id: string }) => {
    console.log('[DirectEditButton] Submitting form with data:', formData);
    
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
        toast.success('Document updated successfully');
        setOpen(false);
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        queryClient.invalidateQueries({ queryKey: ['dashboardRealDocuments'] });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error('Failed to update document');
      }
    } catch (error) {
      console.error('[DirectEditButton] Error updating document:', error);
      toast.error('An error occurred while updating the document');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Button for icon mode
  if (mode === 'icon') {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <EditDialog 
          document={document}
          open={open}
          onOpenChange={setOpen}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </>
    );
  }
  
  // MenuItem for dropdown menus
  return (
    <>
      <DropdownMenuItem 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('[DirectEditButton] Edit menu item clicked for document:', document.id);
          setOpen(true);
        }}
      >
        <Edit className="h-4 w-4 mr-2" />
        <span>Edit</span>
      </DropdownMenuItem>
      
      <EditDialog 
        document={document}
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

// Self-contained edit dialog component
const EditDialog: React.FC<{
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: DocumentFormValues & { id: string }) => void;
  isSubmitting: boolean;
}> = ({ document, open, onOpenChange, onSubmit, isSubmitting }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
        </DialogHeader>
        <EditDocumentForm 
          document={document}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DirectEditButton;
