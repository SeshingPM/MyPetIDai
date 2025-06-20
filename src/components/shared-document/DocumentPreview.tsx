import React, { useState, useEffect } from "react";
import { FileImage, FileText, AlertCircle } from "lucide-react";
import { Document } from "@/utils/types";
import { Button } from "@/components/ui/button";
import logger from "@/utils/logger";

interface DocumentPreviewProps {
  document: Document;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document }) => {
  const [error, setError] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the URL is valid and accessible
  useEffect(() => {
    if (!document.fileUrl) {
      setError("No file URL available");
      setIsLoading(false);
      return;
    }

    // Reset state when document changes
    setError(null);
    setImagePreviewUrl(null);
    setIsLoading(true);

    const checkUrl = async () => {
      try {
        if (document.fileType?.includes("image")) {
          // For images, we can directly use the URL
          setImagePreviewUrl(document.fileUrl);
        }
        // For PDFs, we'll use an iframe in the render function
        setIsLoading(false);
      } catch (err) {
        logger.error("Error checking document URL:", err);
        setError("Could not load document preview");
        setIsLoading(false);
      }
    };

    checkUrl();
  }, [document.fileUrl, document.fileType]);

  // Render different preview content based on file type
  const renderPreviewContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse">Loading preview...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-amber-600">
          <AlertCircle size={32} className="mb-2" />
          <p className="text-sm">{error}</p>
        </div>
      );
    }

    if (document.fileType?.includes("image") && imagePreviewUrl) {
      return (
        <div className="flex justify-center">
          <img
            src={imagePreviewUrl}
            alt={document.name}
            className="max-h-64 object-contain rounded"
            onError={() => setError("Image could not be loaded")}
          />
        </div>
      );
    }

    if (document.fileType?.includes("pdf")) {
      return (
        <div className="space-y-3">
          <div className="h-40 border rounded overflow-hidden">
            <iframe
              src={`${document.fileUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full"
              title={document.name}
              onError={() => setError("PDF could not be loaded")}
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
          <div className="text-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(document.fileUrl, "_blank")}
              className="text-xs"
            >
              <FileText className="h-3.5 w-3.5 mr-1" />
              Open PDF in full view
            </Button>
          </div>
        </div>
      );
    }

    // Fallback for other file types
    return (
      <div className="text-center py-4">
        <p>
          Preview not available for this file type. Please download to view.
        </p>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Document Preview
      </h3>
      <div className="bg-white p-4 rounded border border-gray-200">
        {renderPreviewContent()}
      </div>
    </div>
  );
};

export default DocumentPreview;
