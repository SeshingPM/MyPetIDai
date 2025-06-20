
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';

interface DocumentsSectionHeaderProps {
  onViewAll: () => void;
}

const DocumentsSectionHeader: React.FC<DocumentsSectionHeaderProps> = ({ onViewAll }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
      <div>
        <h3 className="text-base font-medium flex items-center text-gray-800">
          <FileText size={18} className="mr-2 text-primary" />
          Recent Documents
        </h3>
        <p className="text-xs text-gray-500">
          Quickly access your latest uploads
        </p>
      </div>
      
      <Button 
        onClick={onViewAll} 
        variant="ghost" 
        size="sm"
        className="text-sm font-medium text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
      >
        View All
        <ArrowRight size={14} />
      </Button>
    </div>
  );
};

export default DocumentsSectionHeader;
