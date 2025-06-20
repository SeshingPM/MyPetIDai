
import React from 'react';
import { Document } from '@/utils/types';
import { useDocumentOpener } from '@/hooks/useDocumentOpener';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface DocumentCardContainerProps {
  document: Document;
  children: React.ReactNode;
}

/**
 * A container component that handles the click behavior for document cards
 */
const DocumentCardContainer: React.FC<DocumentCardContainerProps> = ({ 
  document, 
  children 
}) => {
  const { openDocument, isOpening } = useDocumentOpener();
  const isMobile = useIsMobile();
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Check if clicking on action buttons (like star icon)
    const isActionButton = !!(e.target as HTMLElement).closest('.action-buttons');
    const isSelectionControl = !!(e.target as HTMLElement).closest('.selection-control');
    
    // Don't trigger if clicking on actions or selection
    if (isActionButton || isSelectionControl) {
      return;
    }
    
    // Prevent rapid multiple clicks
    if (isOpening) {
      return;
    }
    
    try {
      openDocument(document);
    } catch (error) {
      console.error('Error opening document:', error);
      toast.error('Could not open the document. Please try again.');
    }
  };
  
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer h-full"
      onClick={handleCardClick}
    >
      {children}
    </div>
  );
};

export default DocumentCardContainer;
