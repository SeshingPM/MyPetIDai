
import React from 'react';
import { Card } from '@/components/ui/card';
import { File, FileText, FileImage, Archive } from 'lucide-react';
import { Document } from '@/utils/types';
import ShareLinkExpiry from '@/components/documents/share/ShareLinkExpiry';
import DocumentPreview from './DocumentPreview';
import DocumentActions from './DocumentActions';

interface DocumentContentProps {
  document: Document;
}

const DocumentContent: React.FC<DocumentContentProps> = ({ document }) => {
  const getFileIcon = () => {
    if (document.fileType?.includes('pdf')) return FileText;
    if (document.fileType?.includes('image')) return FileImage;
    if (document.fileType?.includes('zip') || document.fileType?.includes('rar')) return Archive;
    if (document.fileType?.includes('text')) return FileText;
    return File;
  };

  const FileIcon = getFileIcon();

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FileIcon size={24} />
          </div>
          
          <div className="flex-grow">
            <h2 className="text-xl font-semibold mb-1">{document.name}</h2>
            <p className="text-sm text-gray-500 mb-1">{document.category}</p>
            {document.shareExpiry && (
              <ShareLinkExpiry 
                expiryDate={document.shareExpiry} 
                showIcon={true} 
                className="text-xs text-amber-600 flex items-center" 
                iconClassName="h-3 w-3 mr-1"
                prefix="Link expires on"
                formatString="PPP"
              />
            )}
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <DocumentPreview document={document} />
          <DocumentActions document={document} />
          
          <div className="text-xs text-gray-500 italic">
            This is a shared document from a Pet Care user. You do not need to log in to view or download this document.
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DocumentContent;
