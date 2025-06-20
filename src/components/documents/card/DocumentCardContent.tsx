
import React from 'react';
import { Document } from '@/utils/types';
import DocumentTitle from './DocumentTitle';
import DocumentBadges from './DocumentBadges';
import DocumentDate from './DocumentDate';
import { PawPrint } from 'lucide-react';

interface DocumentCardContentProps {
  document: Document;
  isArchiveView?: boolean;
}

const DocumentCardContent: React.FC<DocumentCardContentProps> = ({ 
  document,
  isArchiveView = false
}) => {
  return (
    <div className="flex flex-col min-w-0 flex-1">
      <DocumentTitle name={document.name} />
      <DocumentBadges document={document} isArchiveView={isArchiveView} />
      
      <div className="flex items-center gap-2 mt-1">
        <DocumentDate date={new Date(document.createdAt)} />
        
        {document.petId && document.petName && (
          <div className="flex items-center text-xs text-gray-500 gap-1 ml-2">
            <PawPrint size={12} className="text-primary" />
            <span>{document.petName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentCardContent;
