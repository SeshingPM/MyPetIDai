
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Document } from '@/utils/types';
import { useDocumentOpener } from '@/hooks/useDocumentOpener';
import { toast } from 'sonner';

interface ViewDocumentButtonProps {
  document: Document;
}

const ViewDocumentButton: React.FC<ViewDocumentButtonProps> = ({ document }) => {
  const { openDocument, isOpening } = useDocumentOpener();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click
    
    // Prevent rapid clicks
    if (isOpening) {
      return;
    }
    
    try {
      openDocument(document);
    } catch (error) {
      console.error('Error opening document from view button:', error);
      toast.error('Could not open the document. Please try again.');
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8 w-8 p-0 hover:bg-primary/10" 
      aria-label="View Document"
      onClick={handleClick}
      type="button"
    >
      <Eye className="h-4 w-4 text-primary" />
    </Button>
  );
};

export default ViewDocumentButton;
