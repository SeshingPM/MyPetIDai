import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import logger from '@/utils/logger';

interface DocumentsHeaderProps {
  onAddDocument: () => void;
  onRefresh: () => void;
}

const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({ onAddDocument, onRefresh }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <FileText className="mr-2 text-primary h-6 w-6" />
          My Documents
        </h1>
        <p className="text-gray-500 mt-1">Manage all your pet's important documents in one place</p>
      </div>
      <div className="flex gap-2 self-start md:self-center">
        {!isMobile && (
          <Button 
            variant="outline" 
            size="icon"
            onClick={onRefresh}
            title="Refresh documents"
            className="border-gray-200 hover:border-gray-300"
          >
            <RefreshCw size={16} />
          </Button>
        )}
        
        <Button 
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          type="button"
          onClick={() => {
            // Check for both Android and iOS
            const userAgent = navigator.userAgent.toLowerCase();
            const isAndroid = /android/i.test(userAgent);
            
            // Enhanced iOS detection that works in private browsing too
            const isIOS = Boolean(
              /iphone|ipad|ipod/i.test(userAgent) || 
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
              /iPad|iPhone|iPod/.test(navigator.userAgent) ||
              (navigator.userAgent.includes("Mac") && "ontouchend" in document)
            );
            
            if (isAndroid) {
              // For Android, redirect to dedicated upload page
              logger.info('[DocumentsHeader] Android detected, redirecting to upload page');
              navigate('/upload');
            } else if (isIOS) {
              // For iOS, redirect to iOS-specific upload page
              logger.info('[DocumentsHeader] iOS detected, redirecting to iOS upload page');
              navigate('/ios-upload');
            } else {
              // For Desktop, use the modal approach
              logger.info('[DocumentsHeader] Desktop detected, opening document upload modal');
              onAddDocument();
            }
          }}
        >
          <Plus size={16} />
          {isMobile ? "Add" : "Add Document"}
        </Button>
      </div>
    </div>
  );
};

export default DocumentsHeader;
