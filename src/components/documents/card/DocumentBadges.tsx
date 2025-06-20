
import React from 'react';
import { Document } from '@/utils/types';
import CategoryBadge from './CategoryBadge';

interface DocumentBadgesProps {
  document: Document;
  isArchiveView?: boolean;
}

const DocumentBadges: React.FC<DocumentBadgesProps> = ({ 
  document, 
  isArchiveView = false 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-1 items-center">
      <CategoryBadge category={document.category} />
      
      {isArchiveView && (
        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
          Archived
        </span>
      )}
      
      {document.petId && (
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10">
          Pet Document
        </span>
      )}
    </div>
  );
};

export default DocumentBadges;
