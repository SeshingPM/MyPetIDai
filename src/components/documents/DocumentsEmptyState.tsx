
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Plus, SearchX } from 'lucide-react';

interface DocumentsEmptyStateProps {
  onAddDocument: () => void;
  searchActive?: boolean;
  onClearSearch?: () => void;
}

const DocumentsEmptyState: React.FC<DocumentsEmptyStateProps> = ({ 
  onAddDocument, 
  searchActive = false,
  onClearSearch
}) => {
  if (searchActive && onClearSearch) {
    return (
      <Card className="border-gray-200 bg-white overflow-hidden">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <SearchX size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No matching documents</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            We couldn't find any documents matching your search criteria. Try adjusting your filters or search terms.
          </p>
          <Button onClick={onClearSearch} variant="outline" className="mr-2">
            Clear filters
          </Button>
          <Button onClick={onAddDocument} variant="default">
            <Plus size={16} className="mr-2" />
            Upload New Document
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 bg-white overflow-hidden">
      <CardContent className="p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-5 bg-primary/10 rounded-full flex items-center justify-center">
          <FileText size={40} className="text-primary" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-3">No documents yet</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Upload important documents like medical records, registration certificates, vaccination records, and more.
        </p>
        <Button onClick={onAddDocument} className="bg-primary text-white hover:bg-primary/90">
          <Plus size={16} className="mr-2" />
          Upload Your First Document
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentsEmptyState;
