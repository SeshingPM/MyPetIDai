import { usePlatform } from "@/contexts/PlatformContext";
import { getSignedDocumentUrl as getSignedUrlFromAccess } from "./access";
import { toast } from "sonner";
import logger from "@/utils/logger";
import { supabase } from "@/integrations/supabase/client";
import {
  openUrlPreserveState,
  preservePageState,
  isIOS,
} from "../mobile-navigation";

/**
 * Platform-aware document download handler
 * Handles downloads differently based on the user's device (Desktop, iOS, Android)
 */

/**
 * Get the file extension from a URL or filename
 */
export const getFileExtension = (fileUrl: string): string => {
  // If no URL provided, return empty
  if (!fileUrl) return "";

  // Remove query parameters
  const cleanUrl = fileUrl.split("?")[0];

  // Get the extension from the path
  const parts = cleanUrl.split(".");
  if (parts.length > 1) {
    return parts.pop()?.toLowerCase() || "";
  }

  return "";
};

/**
 * Get MIME type from file extension
 */
export const getMimeTypeFromExtension = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    txt: "text/plain",
    csv: "text/csv",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };

  // Default to PDF if we can't determine the type
  return mimeTypes[extension.toLowerCase()] || "application/pdf";
};

/**
 * Extract filename from URL
 */
export const getFilenameFromUrl = (url: string): string => {
  if (!url) return "document";

  try {
    // Remove query parameters
    const urlWithoutParams = url.split("?")[0];

    // Get the last part of the path
    const pathParts = urlWithoutParams.split("/");
    const filenameWithExtension = pathParts[pathParts.length - 1];

    // Decode the filename (handle URL encoding)
    return decodeURIComponent(filenameWithExtension);
  } catch (error) {
    // If there's any error parsing the URL, return a default name
    return "document";
  }
};

/**
 * Ensure the filename has a proper extension
 */
export const ensureFileExtension = (
  filename: string,
  originalUrl: string,
  defaultExt: string = "pdf"
): string => {
  if (!filename) return `document.${defaultExt}`;

  // Check if filename already has an extension
  if (filename.includes(".") && filename.split(".").pop()?.length) {
    return filename;
  }

  // Try to get extension from the URL
  const extension = getFileExtension(originalUrl);
  if (extension) {
    return `${filename}.${extension}`;
  }

  // Fall back to default extension
  return `${filename}.${defaultExt}`;
};

/**
 * Handle download for desktop browsers
 * Uses the Blob approach with download attribute
 */
export const handleDesktopDownload = async (
  documentId: string,
  documentUrl: string,
  filename: string
): Promise<boolean> => {
  try {
    // Get signed URL for document
    const signedUrl = await getDocumentSignedUrl(documentId);
    if (!signedUrl) {
      logger.error("[Download] No URL available for document");

      // Try downloading directly from the original URL
      if (documentUrl) {
        logger.info("[Download] Attempting direct download from original URL");
        return await downloadFromDirectUrl(documentUrl, filename);
      }

      toast.error("Could not generate download URL");
      return false;
    }

    // Ensure filename has proper extension
    const properFilename = ensureFileExtension(
      filename,
      documentUrl || signedUrl
    );

    // Get file extension and MIME type
    const extension =
      getFileExtension(properFilename) || getFileExtension(signedUrl) || "pdf";
    const mimeType = getMimeTypeFromExtension(extension);

    logger.info(
      `[Download] Using extension: ${extension}, MIME type: ${mimeType}, filename: ${properFilename}`
    );

    // Use fetch to get the file content
    logger.info("[Download] Fetching content from URL");
    const response = await fetch(signedUrl);
    if (!response.ok) {
      logger.error(
        `[Download] Fetch error: ${response.status} ${response.statusText}`
      );

      // Try downloading from direct URL
      if (documentUrl) {
        logger.info("[Download] Attempting direct download after fetch error");
        return await downloadFromDirectUrl(documentUrl, filename);
      }

      // On fetch error, try opening URL directly as last resort
      window.open(signedUrl, "_blank");
      toast.info("Opening document in new tab instead");
      return true;
    }

    // Get the content type from the response if available
    const contentType = response.headers.get("content-type");
    const responseType = contentType || mimeType;

    logger.info(`[Download] Response content type: ${responseType}`);

    // Create a blob from the response
    const blob = await response.blob();
    const blobWithType = new Blob([blob], { type: responseType });

    // Create a URL for the blob
    const blobUrl = URL.createObjectURL(blobWithType);

    // Create an anchor element and trigger download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = properFilename;
    link.style.display = "none";

    // Force download attribute with both properties
    link.setAttribute("download", properFilename);

    // Add to DOM, click, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 100);

    return true;
  } catch (error) {
    logger.error("Error in desktop download:", error);

    // Try direct URL download as fallback
    if (documentUrl) {
      logger.info("[Download] Attempting direct download after error");
      return await downloadFromDirectUrl(documentUrl, filename);
    }

    toast.error("Download failed");
    return false;
  }
};

/**
 * Helper function to download from a direct URL
 */
export const downloadFromDirectUrl = async (
  url: string,
  filename: string
): Promise<boolean> => {
  try {
    logger.info(
      `[Download] Downloading from direct URL with filename: ${filename}`
    );

    // Ensure filename has a proper extension
    const properFilename = ensureFileExtension(filename, url);

    // Get file extension and MIME type
    const extension =
      getFileExtension(properFilename) || getFileExtension(url) || "pdf";
    const mimeType = getMimeTypeFromExtension(extension);

    logger.info(
      `[Download] Using extension: ${extension}, MIME type: ${mimeType}`
    );

    // Use fetch to get the file content
    const response = await fetch(url);
    if (!response.ok) {
      logger.error(
        `[Download] Direct URL fetch error: ${response.status} ${response.statusText}`
      );

      // On fetch error, try opening URL directly as last resort
      window.open(url, "_blank");
      toast.info("Opening document in new tab instead");
      return true;
    }

    // Get the content type from the response if available
    const contentType = response.headers.get("content-type");
    const responseType = contentType || mimeType;

    logger.info(`[Download] Response content type: ${responseType}`);

    // Create a blob from the response
    const blob = await response.blob();
    const blobWithType = new Blob([blob], { type: responseType });

    // Create a URL for the blob
    const blobUrl = URL.createObjectURL(blobWithType);

    // Create an anchor element and trigger download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = properFilename;
    link.style.display = "none";

    // Force download attribute with both properties
    link.setAttribute("download", properFilename);

    // Add to DOM, click, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 100);

    return true;
  } catch (error) {
    logger.error("Error in direct URL download:", error);

    // Last resort - open in new tab
    window.open(url, "_blank");
    toast.info("Opening document in new tab instead");
    return true;
  }
};

/**
 * Handle download for iOS devices
 * iOS has limitations with direct downloads, so we open in a new tab with instructions
 */
export const handleIOSDownload = async (
  documentId: string,
  documentUrl: string
): Promise<boolean> => {
  try {
    console.log("[iOS Download] Handler called", { documentId, documentUrl });

    // Check and refresh session if needed
    const { data: { session } } = await supabase.auth.getSession();
    if (
      !session ||
      (session.expires_at &&
        session.expires_at <= Math.floor(Date.now() / 1000))
    ) {
      console.log("[iOS Download] Session expired, attempting refresh");
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error("[iOS Download] Session refresh failed:", refreshError);
        toast.error("Your session has expired. Please log in again.");
        return false;
      }
      console.log("[iOS Download] Session refreshed successfully");
    }

    // Get a URL to use - signed URL first, fallback to original URL
    let urlToUse = "";
    try {
      const signedUrl = await getDocumentSignedUrl(documentId);
      urlToUse = signedUrl || documentUrl;
    } catch (error) {
      console.error("[iOS Download] Error getting signed URL:", error);
      urlToUse = documentUrl;
    }

    // Show iOS-specific instructions
    toast.info(
      'To save this document on iOS: tap and hold the document, then select "Save to Files"',
      {
        duration: 10000,
        className: "ios-instruction-toast",
        position: "top-center",
      }
    );

    // Preserve the current page state before opening new window
    preservePageState();

    // Open URL in new window while preserving state
    openUrlPreserveState(urlToUse);

    return true;
  } catch (error) {
    console.error("[iOS Download] Unexpected error:", error);
    toast.error("Failed to open document. Please try again.");
    return false;
  }
};

/**
 * Handle download for Android devices
 * Uses direct download link with proper headers
 */
export const handleAndroidDownload = async (
  documentId: string,
  documentUrl: string,
  filename: string
): Promise<boolean> => {
  try {
    // Get signed URL for document
    const signedUrl = await getDocumentSignedUrl(documentId);
    if (!signedUrl) {
      logger.error("[Download] No URL available for document on Android");

      // Try direct download with the original URL
      if (documentUrl) {
        logger.info(
          "[Download] Attempting direct download with original URL on Android"
        );
        return await downloadFromDirectUrl(documentUrl, filename);
      }

      toast.error("Could not generate download URL");
      return false;
    }

    // Ensure filename has proper extension
    const properFilename = ensureFileExtension(
      filename,
      documentUrl || signedUrl
    );
    logger.info(
      `[Download] Android download using filename: ${properFilename}`
    );

    // On Samsung browsers, which have known issues with downloads,
    // try direct download first, then fall back to window.open if needed
    if (navigator.userAgent.toLowerCase().includes("samsungbrowser")) {
      try {
        logger.info("[Download] Using Samsung-specific download approach");
        toast.info("Preparing your download...");

        // Try to use our blob download method
        const success = await downloadFromDirectUrl(signedUrl, properFilename);
        if (success) return true;

        // If it doesn't work, fall back to opening in new tab
        window.open(signedUrl, "_blank");
        return true;
      } catch (samsungError) {
        logger.error("Samsung browser download error:", samsungError);
        window.open(signedUrl, "_blank");
        return true;
      }
    }

    // For other Android browsers, use our direct download function
    return await downloadFromDirectUrl(signedUrl, properFilename);
  } catch (error) {
    logger.error("Error in Android download:", error);

    // Try fallbacks in order of preference
    try {
      // 1. Try direct download with the URL we already have
      if (documentUrl) {
        // Ensure filename has proper extension
        const properFilename = ensureFileExtension(filename, documentUrl);
        logger.info(
          "[Download] Trying direct download with original URL after error"
        );
        return await downloadFromDirectUrl(documentUrl, properFilename);
      }

      // 2. Try to get a signed URL one more time
      const signedUrl = await getDocumentSignedUrl(documentId);
      if (signedUrl) {
        // Ensure filename has proper extension
        const properFilename = ensureFileExtension(filename, signedUrl);
        logger.info("[Download] Trying direct download with fresh signed URL");
        return await downloadFromDirectUrl(signedUrl, properFilename);
      }

      // 3. Last resort - just open the URL we have
      if (documentUrl) {
        logger.info("[Download] Opening URL in new tab as last resort");
        window.open(documentUrl, "_blank");
        return true;
      }
    } catch (fallbackError) {
      logger.error("Error in Android fallback:", fallbackError);
    }

    toast.error("Download failed");
    return false;
  }
};

/**
 * Main platform-aware download function
 */
export const downloadDocument = async (
  documentId: string,
  documentUrl: string,
  documentName: string
): Promise<boolean> => {
  // Extract platform info with improved iOS detection
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = /android/i.test(userAgent);
  const isIOS =
    /iphone|ipad|ipod/i.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
    (/iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !/MSStream/i.test(navigator.userAgent));

  // Log download attempt with platform info
  logger.info(`[Download] Starting document download for ID: ${documentId}`);
  logger.info(
    `[Download] Platform detection: iOS: ${isIOS}, Android: ${isAndroid}, UserAgent: ${userAgent.substring(0, 100)}`
  );

  // Make sure we have a valid filename with extension
  const baseFilename =
    documentName || getFilenameFromUrl(documentUrl || "document");
  const filename = ensureFileExtension(baseFilename, documentUrl, "pdf");

  logger.info(`[Download] Using filename: ${filename}`);

  // For iOS, always use the tab-opening approach
  if (isIOS) {
    logger.info("[Download] iOS device detected, using tab opening approach");

    // For direct URLs without document ID
    if (!documentId && documentUrl) {
      logger.info("[Download] No document ID, using direct URL for iOS");
      window.open(documentUrl, "_blank");
      return true;
    }

    // Use the iOS-specific handler
    logger.info("[Download] Using iOS-specific download handler");
    return await handleIOSDownload(documentId, documentUrl);
  }

  // Ensure we have either a document ID or URL
  if (!documentId && !documentUrl) {
    toast.error("No document information available");
    return false;
  }

  try {
    // Check if we should try to get a signed URL or use the direct URL
    // If we don't have a document ID or we're in a testing/development environment, use direct download
    const useDirectUrl =
      !documentId || window.location.hostname === "localhost";

    if (useDirectUrl && documentUrl) {
      logger.info("[Download] Using direct download without database lookup");

      if (isIOS) {
        window.open(documentUrl, "_blank");
        return true;
      } else {
        // For other platforms, try actual download
        return await downloadFromDirectUrl(documentUrl, filename);
      }
    }

    // Handle download based on platform
    if (isIOS) {
      logger.info("[Download] Using iOS-specific download handler");
      return await handleIOSDownload(documentId, documentUrl);
    } else if (isAndroid) {
      logger.info("[Download] Using Android-specific download handler");
      return await handleAndroidDownload(documentId, documentUrl, filename);
    } else {
      logger.info("[Download] Using desktop download handler");
      return await handleDesktopDownload(documentId, documentUrl, filename);
    }
  } catch (error) {
    logger.error("Error downloading document:", error);

    // If the error is about file path not found, provide clearer message and use direct URL
    if (
      error instanceof Error &&
      (error.message.includes("file path") ||
        error.message.includes("not found") ||
        error.message.includes("column"))
    ) {
      logger.info(
        "[Download] Database structure issue detected, trying direct download"
      );

      if (documentUrl) {
        if (isIOS) {
          // For iOS, open in new tab
          toast.info("Using alternative download method...");
          window.open(documentUrl, "_blank");
          return true;
        } else {
          // For other platforms, try actual download
          toast.info("Using alternative download method...");
          return await downloadFromDirectUrl(documentUrl, filename);
        }
      } else {
        toast.error(
          "Document could not be found. It may have been deleted or moved."
        );
      }
    } else {
      toast.error("Could not download the document");
    }

    // Final fallback if all else fails
    if (documentUrl) {
      logger.info("[Download] Final fallback to direct URL after error");
      try {
        if (isIOS) {
          toast.info("Opening document in new tab...");
          window.open(documentUrl, "_blank");
          return true;
        } else {
          toast.info("Trying alternative download method...");
          return await downloadFromDirectUrl(documentUrl, filename);
        }
      } catch (fallbackError) {
        logger.error("Error in fallback download:", fallbackError);
        // Last resort - just open in a new tab
        window.open(documentUrl, "_blank");
        return true;
      }
    }

    return false;
  }
};

export const getDocumentSignedUrl = async (
  documentId: string
): Promise<string | null> => {
  try {
    console.log("[Supabase] Fetching document details for ID:", documentId);

    // Log the current session state
    const { data: { session } } = await supabase.auth.getSession();
    console.log("[Supabase] Auth state:", {
      hasSession: !!session,
      tokenExpiry: session?.expires_at,
      accessToken: session?.access_token ? "Present" : "Missing",
    });

    // First get the document details
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("file_url,storage_path,storage_bucket")
      .eq("id", documentId)
      .single();
      
    // Define a type for our document to help TypeScript
    type DocumentWithStorage = {
      file_url?: string;
      storage_path?: string;
      storage_bucket?: string;
    };

    if (docError) {
      console.error("[Supabase] Error fetching document:", docError);
      throw docError;
    }

    if (!document) {
      console.error("[Supabase] Document not found");
      return null;
    }
    
    // Cast document to our type to help TypeScript
    const typedDocument = document as unknown as DocumentWithStorage;

    console.log("[Supabase] Document details retrieved:", {
      hasFileUrl: !!typedDocument.file_url,
      hasStoragePath: !!typedDocument.storage_path,
      bucket: typedDocument.storage_bucket,
    });

    // If we have a storage path, get a signed URL
    if (typedDocument.storage_path) {
      console.log(
        "[Supabase] Getting signed URL for path:",
        typedDocument.storage_path
      );
      const { data: signedUrl, error: signError } = await supabase.storage
        .from(typedDocument.storage_bucket || "documents")
        .createSignedUrl(typedDocument.storage_path, 60); // 60 seconds expiry

      if (signError) {
        console.error("[Supabase] Error getting signed URL:", signError);
        throw signError;
      }

      console.log("[Supabase] Successfully generated signed URL");
      return signedUrl.signedUrl; // Note: property is signedUrl (lowercase u)
    }

    // Fallback to file_url if no storage path
    console.log("[Supabase] Using direct file_url");
    return typedDocument.file_url;
  } catch (error) {
    console.error("[Supabase] Critical error in getSignedDocumentUrl:", error);
    logger.error("Error getting signed URL:", error);
    return null;
  }
};
