import { useState, useEffect } from "react";
import { Document } from "@/utils/types";
import { getDocumentByShareId } from "@/utils/document-sharing";
import { toast } from "sonner";

interface UseDocumentLoaderOptions {
  shareId?: string;
  skipLoading?: boolean;
}

/**
 * Custom hook for document loading and state management
 */
export const useDocumentLoader = (options: UseDocumentLoaderOptions = {}) => {
  const { shareId, skipLoading = false } = options;
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(!skipLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[DEBUG] useDocumentLoader initialized with shareId:", shareId);

    // Skip loading if specified
    if (skipLoading) {
      console.log("[DEBUG] Skipping document loading (skipLoading=true)");
      setLoading(false);
      return;
    }

    // Skip loading if no shareId is provided
    if (!shareId) {
      console.log("[DEBUG] No shareId provided, setting error");
      setError("Invalid share link");
      setLoading(false);
      return;
    }

    const loadDocument = async () => {
      console.log("[DEBUG] Starting to load document with shareId:", shareId);
      try {
        console.log("[DEBUG] Calling getDocumentByShareId with:", shareId);
        const doc = await getDocumentByShareId(shareId);
        console.log("[DEBUG] getDocumentByShareId result:", doc);

        if (!doc) {
          console.log("[DEBUG] Document not found, setting error");
          setError("Document not found or share link has expired");
        } else {
          console.log("[DEBUG] Document found, setting document state");
          setDocument(doc);
        }
      } catch (err) {
        console.error("[DEBUG] Error loading shared document:", err);
        setError("Failed to load document. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [shareId, skipLoading]);

  /**
   * Set a new document manually (useful for testing or setting from external source)
   */
  const setCurrentDocument = (doc: Document | null) => {
    console.log("[DEBUG] Manually setting document:", doc);
    setDocument(doc);
  };

  /**
   * Reset the document loader state
   */
  const resetState = () => {
    console.log("[DEBUG] Resetting document loader state");
    setDocument(null);
    setError(null);
    setLoading(!skipLoading);
  };

  return {
    document,
    loading,
    error,
    setDocument: setCurrentDocument,
    resetState,
  };
};
