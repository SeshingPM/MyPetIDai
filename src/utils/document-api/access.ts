
import { supabase } from "@/integrations/supabase/client";
import logger from "@/utils/logger";

/**
 * Get a downloadable URL for a document
 * @param documentId The ID of the document to get a URL for
 * @returns A URL that can be used to download or view the document
 */
export const getSignedDocumentUrl = async (
  documentId: string
): Promise<string> => {
  try {
    // Log the request for debugging
    logger.info(`[Download] Fetching signed URL for document: ${documentId}`);

    // Query only for columns we know exist
    const { data, error } = await supabase
      .from("documents")
      .select("file_url")
      .eq("id", documentId)
      .single();

    if (error) {
      logger.error(
        `[Download] Database error fetching document: ${error.message}`,
        error
      );
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      logger.error(`[Download] Document not found: ${documentId}`);
      throw new Error("Document not found");
    }

    // If we have file_url, use that directly
    if (data.file_url) {
      logger.info("[Download] Using file_url directly");
      return data.file_url;
    }

    // If we have no URL information at all
    logger.error("[Download] Document has no file URL information");
    throw new Error("Document URL not found");
  } catch (error) {
    // Log the error but don't throw it - this makes the function more resilient
    logger.error("[Download] Error getting document URL:", error);

    // Return empty string to indicate failure but allow the caller to handle it gracefully
    return "";
  }
};

/**
 * Synchronous version that returns a placeholder URL - this can be used
 * when we just need a URL to attach to onClick handlers, and the actual
 * URL will be fetched when the user clicks
 */
export const getDocumentUrl = (documentId: string): string => {
  // This URL will be handled by the app to fetch and redirect to the actual document
  return `/documents/${documentId}`;
};
