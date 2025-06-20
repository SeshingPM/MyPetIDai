import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileDown, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Document } from "@/utils/types";
import logger from "@/utils/logger";
import { downloadDocument } from "@/utils/document-api/download";

interface DocumentActionsProps {
  document: Document;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({ document }) => {
  // iOS detection for platform-specific UI
  const isIOS =
    /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
    (/iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !/MSStream/i.test(navigator.userAgent));

  const handleDownload = async () => {
    if (!document) return;

    try {
      logger.info(`Initiating download for shared document: ${document.id}`);
      logger.info(`Platform detected: ${isIOS ? "iOS" : "Desktop/Android"}`);

      // Use the enhanced downloadDocument function which handles platform-specific behavior
      const success = await downloadDocument(
        document.id,
        document.fileUrl,
        document.name
      );

      if (!success) {
        // If the enhanced download fails, fall back to the old method
        logger.info(
          "Enhanced download failed, falling back to direct URL open"
        );
        window.open(document.fileUrl, "_blank");

        // Show platform-specific message
        if (isIOS) {
          toast.info('Document opened. Tap and hold to "Save to Files"', {
            duration: 7000,
            className: "ios-instruction-toast",
          });
        } else {
          toast.info("Document opened in new tab");
        }
      }
    } catch (error) {
      logger.error("Error downloading shared document:", error);
      toast.error("Failed to download document");

      // Try to open in new tab as last resort
      try {
        window.open(document.fileUrl, "_blank");

        // Show platform-specific message
        if (isIOS) {
          toast.info('Document opened. Tap and hold to "Save to Files"', {
            duration: 7000,
            className: "ios-instruction-toast",
          });
        } else {
          toast.info("Opening document in new tab instead");
        }
      } catch (e) {
        toast.error("Could not access document");
      }
    }
  };

  return (
    <div className="border-t pt-4">
      <Button onClick={handleDownload} className="w-full sm:w-auto">
        {isIOS ? (
          <ExternalLink className="mr-2 h-4 w-4" />
        ) : (
          <FileDown className="mr-2 h-4 w-4" />
        )}
        {isIOS ? "Open & Save to Files" : "Download Document"}
      </Button>
    </div>
  );
};

export default DocumentActions;
