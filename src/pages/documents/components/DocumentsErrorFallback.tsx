
import React from 'react';

interface DocumentsErrorFallbackProps {
  onRefresh: () => void;
}

const DocumentsErrorFallback: React.FC<DocumentsErrorFallbackProps> = ({ onRefresh }) => {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-medium text-red-600 mb-2">Something went wrong displaying documents</h3>
      <p className="text-gray-500 mb-4">We encountered an error while trying to load your documents.</p>
      <button 
        onClick={onRefresh}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  );
};

export default DocumentsErrorFallback;
