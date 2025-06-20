import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { FileUp } from "lucide-react";
import DocumentScanner from "./DocumentScanner";
import FileDisplay from "./upload/FileDisplay";
import FileDropZone from "./upload/FileDropZone";
import ScannerButton from "./upload/ScannerButton";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { DOCUMENT_EVENTS } from "@/utils/analytics-events";
import { usePlatform } from "@/contexts/PlatformContext";

interface FileUploadSectionProps {
  file: File | null;
  setFile: (file: File | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  file,
  setFile,
  handleFileChange,
  isUploading,
}) => {
  const [showScanner, setShowScanner] = useState(false);
  const { trackEvent } = useAnalytics();
  const { isIOS } = usePlatform();

  const handleCapture = (capturedFile: File) => {
    console.log("File captured from scanner:", capturedFile.name);
    setFile(capturedFile);
    setShowScanner(false);

    // Track the document scanning event
    trackEvent(DOCUMENT_EVENTS.UPLOADED, {
      method: "scanner",
      fileType: capturedFile.type,
      fileSize: capturedFile.size,
      fileName: capturedFile.name,
    });
  };

  const handleFileSet = (newFile: File | null) => {
    const previousFile = file;
    setFile(newFile);

    // Track when a file is removed
    if (previousFile && !newFile) {
      trackEvent("document_removed_before_upload", {
        fileType: previousFile.type,
        fileSize: previousFile.size,
        fileName: previousFile.name,
      });
    }
  };

  const handleDrop = (droppedFile: File) => {
    setFile(droppedFile);

    // Track the document upload via drag and drop
    trackEvent(DOCUMENT_EVENTS.UPLOADED, {
      method: "drag_and_drop",
      fileType: droppedFile.type,
      fileSize: droppedFile.size,
      fileName: droppedFile.name,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e);

    // If files were selected, track the upload
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];

      trackEvent(DOCUMENT_EVENTS.UPLOADED, {
        method: "file_browser",
        fileType: uploadedFile.type,
        fileSize: uploadedFile.size,
        fileName: uploadedFile.name,
      });
    }
  };

  const handleScannerOpen = () => {
    setShowScanner(true);
    trackEvent("document_scanner_opened");
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload">Document File</Label>

      {showScanner ? (
        <DocumentScanner
          onCapture={handleCapture}
          onCancel={() => {
            setShowScanner(false);
            trackEvent("document_scanner_cancelled");
          }}
        />
      ) : file ? (
        <FileDisplay
          file={file}
          setFile={handleFileSet}
          isUploading={isUploading}
        />
      ) : (
        <div className="grid w-full gap-1.5">
          <div className="border-2 border-dashed rounded-lg p-4">
            <form onSubmit={(e) => e.preventDefault()} className="upload-form">
              <div
                onClick={() => document.getElementById('file-upload')?.click()}
                className="cursor-pointer p-4 text-center"
                role="button"
                tabIndex={0}
              >
                <div className="flex flex-col items-center">
                  <div className="mb-3">
                    <FileUp className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Click to select a file</p>
                  <p className="text-xs text-gray-400">PDF, JPG, PNG, DOC, DOCX</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    e.preventDefault(); // Prevent form submission
                    handleInputChange(e);
                  }}
                  accept="image/jpeg,image/png,application/pdf,.jpg,.jpeg,.png,.pdf,.doc,.docx"
                  disabled={isUploading}
                />
              </div>
            </form>
            
            {/* Scanner button for desktop users */}
              <div className="mt-3">
                {/* Only show the 'or' text for desktop, not for iOS */}
                {!isIOS && (
                  <div className="flex justify-center items-center">
                    <span className="text-center text-sm text-gray-500 px-3">or</span>
                  </div>
                )}
                <div className="mt-3 flex justify-center">
                  <ScannerButton 
                    setShowScanner={setShowScanner}
                    isUploading={isUploading}
                  />
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
