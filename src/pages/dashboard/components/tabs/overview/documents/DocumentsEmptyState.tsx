
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

interface DocumentsEmptyStateProps {
  onAddDocument: () => void;
}

const DocumentsEmptyState: React.FC<DocumentsEmptyStateProps> = ({ onAddDocument }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 rounded-xl">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <FileText size={28} className="text-primary/70" />
      </div>
      <h3 className="text-base font-medium text-gray-700 mb-2">No documents yet</h3>
      <p className="text-gray-500 mb-4 max-w-md text-sm">
        Upload important documents like vaccination records, medical history, and more.
      </p>
      <Button 
        onClick={onAddDocument} 
        className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-md transition-all"
      >
        <Plus size={16} className="mr-2" />
        Add Document
      </Button>
    </div>
  );
};

export default DocumentsEmptyState;
