
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDocumentLoader } from '@/hooks/useDocumentLoader';
import DocumentViewer from './DocumentViewer';

const DocumentViewerExample: React.FC = () => {
  const [shareIdInput, setShareIdInput] = useState('');
  const [currentShareId, setCurrentShareId] = useState('');
  
  const { 
    document, 
    loading, 
    error, 
    resetState 
  } = useDocumentLoader({ 
    shareId: currentShareId,
    skipLoading: currentShareId === '' 
  });

  const handleLoad = () => {
    resetState();
    setCurrentShareId(shareIdInput);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Document Viewer Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter share ID"
            value={shareIdInput}
            onChange={(e) => setShareIdInput(e.target.value)}
          />
          <Button onClick={handleLoad}>Load Document</Button>
        </div>

        <div className="mt-4">
          {!currentShareId ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              Enter a share ID to load a document
            </div>
          ) : (
            <DocumentViewer 
              shareId={currentShareId} 
              document={document}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentViewerExample;
