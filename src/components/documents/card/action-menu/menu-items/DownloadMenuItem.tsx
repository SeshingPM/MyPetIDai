import React, { useState } from "react";
import { Download, FileDown, ExternalLink } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Document } from "@/utils/types";
import { toast } from "sonner";
import logger from "@/utils/logger";
import { downloadDocument } from "@/utils/document-api/download";

interface DownloadMenuItemProps {
  document: Document;
}

export const DownloadMenuItem: React.FC<DownloadMenuItemProps> = ({
  document,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Enhanced iOS detection with multiple patterns
  const isIOS =
    /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
    (/iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !/MSStream/i.test(navigator.userAgent));

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Prevent duplicate download attempts
    if (isDownloading) return;

    try {
      setIsDownloading(true);

      if (!document.fileUrl) {
        toast.error("Document URL is missing");
        return;
      }

      // Show platform-specific initial message
      if (isIOS) {
        toast.info("Preparing document for iOS viewing...");
      } else {
        toast.info("Preparing download...");
      }

      // Log document details for debugging
      logger.info(`[Download] Attempting to download document: ${document.id}`);
      logger.info(`[Download] Document details:`, {
        id: document.id,
        name: document.name,
        fileType: document.fileType,
        // Log only the first 50 chars of URL to avoid sensitive data in logs
        fileUrl: document.fileUrl?.substring(0, 50) + "...",
        platform: isIOS ? "iOS" : "desktop/Android",
      });

      // Use the platform-aware download utility
      const success = await downloadDocument(
        document.id,
        document.fileUrl,
        document.name
      );

      if (!success) {
        // If the download utility failed but returned gracefully,
        // try direct fallback as last resort
        logger.info(
          "[Download] Primary download failed, trying direct fallback"
        );
        window.open(document.fileUrl, "_blank");
      }
    } catch (error) {
      logger.error("Error in download handler:", error);

      // Try to provide a helpful error message
      if (error instanceof Error) {
        if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          toast.error(
            "Network error. Please check your connection and try again."
          );
        } else if (
          error.message.includes("permission") ||
          error.message.includes("access")
        ) {
          toast.error("You don't have permission to download this document.");
        } else {
          toast.error("Could not download the document");
        }
      } else {
        toast.error("Could not download the document");
      }

      // Last resort fallback
      try {
        if (document.fileUrl) {
          logger.info("[Download] Attempting direct URL open as last resort");
          window.open(document.fileUrl, "_blank");
        }
      } catch (fallbackError) {
        logger.error("Error in fallback download:", fallbackError);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleDownload}
      className="cursor-pointer"
      disabled={isDownloading}
    >
      {isIOS ? (
        <ExternalLink className="mr-2 h-4 w-4" />
      ) : (
        <FileDown className="mr-2 h-4 w-4" />
      )}
      {isDownloading
        ? "Processing..."
        : isIOS
          ? "Open & Save to Files"
          : "Download"}
    </DropdownMenuItem>
  );
};

// Add default export to fix the import error
export default DownloadMenuItem;
