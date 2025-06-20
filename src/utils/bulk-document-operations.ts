import { Document } from "@/utils/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  permanentlyDeleteDocument,
  restoreDocument,
} from "./document-api/archive";
import { downloadDocument } from "./document-api/download";
import logger from "@/utils/logger";

/**
 * Download multiple documents as a batch
 */
export const bulkDownloadDocuments = async (
  documents: Document[]
): Promise<void> => {
  if (documents.length === 0) return;

  // Show initial notification
  toast.info(`Preparing ${documents.length} documents for download...`);

  // For desktop browsers, we can download all at once
  // For mobile, we should space them out to avoid browser issues
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile =
    /android|iphone|ipad|ipod/i.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  try {
    if (isMobile) {
      // On mobile, download one at a time with delay to avoid browser issues
      toast.info(`On mobile devices, documents will download one at a time`);

      // Only process the first 5 on mobile to avoid overwhelming the browser
      const documentsToProcess =
        documents.length > 5 ? documents.slice(0, 5) : documents;

      if (documents.length > 5) {
        toast.info(
          `For mobile performance, only the first 5 documents will be downloaded`
        );
      }

      // Process documents sequentially with a delay
      for (let i = 0; i < documentsToProcess.length; i++) {
        const doc = documentsToProcess[i];
        await downloadDocument(doc.id, doc.fileUrl, doc.name);

        // Small delay between downloads on mobile
        if (i < documentsToProcess.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    } else {
      // On desktop, we can handle multiple downloads at once
      // Process in smaller batches to be safe
      const batchSize = 3;

      for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);

        // Process batch in parallel
        await Promise.all(
          batch.map((doc) => downloadDocument(doc.id, doc.fileUrl, doc.name))
        );

        // Small delay between batches
        if (i + batchSize < documents.length) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    }

    toast.success(
      `${documents.length} document${documents.length > 1 ? "s" : ""} prepared for download`
    );
  } catch (error) {
    logger.error("Error in bulk download:", error);
    toast.error("There was an issue with some downloads");
  }
};

/**
 * Archive multiple documents with improved error handling
 */
export const bulkArchiveDocuments = async (
  documents: Document[]
): Promise<boolean> => {
  if (documents.length === 0) return false;

  try {
    // Get current user
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("Authentication error in bulkArchiveDocuments:", authError);
      toast.error("Authentication error. Please try again.");
      return false;
    }

    if (!userData?.user) {
      toast.error("You must be logged in to archive documents");
      return false;
    }

    // Validate documents before proceeding
    const validDocuments = documents.filter((doc) => !!doc.id);

    if (validDocuments.length !== documents.length) {
      console.warn(
        `${documents.length - validDocuments.length} documents were skipped due to missing IDs`
      );
    }

    if (validDocuments.length === 0) {
      toast.error("No valid documents to archive");
      return false;
    }

    // Create array of document IDs to archive
    const documentIds = validDocuments.map((doc) => doc.id);

    // Update documents to archived status
    const { error: dbError } = await supabase
      .from("documents")
      .update({ archived: true })
      .in("id", documentIds)
      .eq("user_id", userData.user.id);

    if (dbError) {
      console.error("Database error in bulkArchiveDocuments:", dbError);
      throw dbError;
    }

    // Add a delay to ensure UI updates properly
    await new Promise((resolve) => setTimeout(resolve, 300));

    toast.success(`${validDocuments.length} documents moved to archive`);
    return true;
  } catch (error) {
    console.error("Error bulk archiving documents:", error);
    toast.error(`Failed to archive documents. Please try again.`);
    return false;
  }
};

/**
 * Permanently delete multiple documents with improved safety
 */
export const bulkPermanentlyDeleteDocuments = async (
  documents: Document[]
): Promise<boolean> => {
  if (documents.length === 0) return false;

  try {
    // Get current user
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error(
        "Authentication error in bulkPermanentlyDeleteDocuments:",
        authError
      );
      toast.error("Authentication error. Please try again.");
      return false;
    }

    if (!userData?.user) {
      toast.error("You must be logged in to delete documents");
      return false;
    }

    // Validate documents before proceeding
    const validDocuments = documents.filter((doc) => !!doc.id);

    if (validDocuments.length !== documents.length) {
      console.warn(
        `${documents.length - validDocuments.length} documents were skipped due to missing IDs`
      );
    }

    if (validDocuments.length === 0) {
      toast.error("No valid documents to delete");
      return false;
    }

    // Validate documents first with improved error handling
    const { data: validationData, error: validationError } = await supabase
      .from("documents")
      .select("id")
      .in(
        "id",
        validDocuments.map((doc) => doc.id)
      )
      .eq("user_id", userData.user.id);

    if (validationError) {
      console.error("Error validating documents:", validationError);
      toast.error("Error checking documents before deletion");
      return false;
    }

    if (!validationData || validationData.length === 0) {
      console.error("No valid documents found for deletion");
      toast.error("No documents found for deletion");
      return false;
    }

    // Only delete documents that exist and belong to the user
    const validDocumentIds = validationData.map((doc) => doc.id);

    // Add a delay before deletion to ensure all processes have completed
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Delete in batches for improved reliability
    const batchSize = 10;
    let successCount = 0;

    for (let i = 0; i < validDocumentIds.length; i += batchSize) {
      const batch = validDocumentIds.slice(i, i + batchSize);

      try {
        // Delete the batch
        const { error: batchError } = await supabase
          .from("documents")
          .delete()
          .in("id", batch)
          .eq("user_id", userData.user.id);

        if (batchError) {
          console.error(
            `Error deleting batch ${i / batchSize + 1}:`,
            batchError
          );
          continue;
        }

        successCount += batch.length;

        // Small delay between batches
        if (i + batchSize < validDocumentIds.length) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      } catch (batchError) {
        console.error(
          `Error processing batch ${i / batchSize + 1}:`,
          batchError
        );
      }
    }

    // Add timeout safety
    if (successCount === 0) {
      toast.error("Failed to delete documents. Please try again.");
      return false;
    }

    if (successCount < validDocumentIds.length) {
      toast.warning(
        `Only ${successCount} of ${validDocumentIds.length} documents were deleted.`
      );
    } else {
      toast.success(`${successCount} documents permanently deleted`);
    }

    return true;
  } catch (error) {
    console.error("Error permanently deleting documents:", error);
    toast.error(`Failed to delete documents. Please try again.`);
    return false;
  }
};

/**
 * Restore multiple documents from archive with improved reliability
 */
export const bulkRestoreDocuments = async (
  documents: Document[]
): Promise<boolean> => {
  if (documents.length === 0) return false;

  try {
    // Get current user
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("Authentication error in bulkRestoreDocuments:", authError);
      toast.error("Authentication error. Please try again.");
      return false;
    }

    if (!userData?.user) {
      toast.error("You must be logged in to restore documents");
      return false;
    }

    // Validate documents before proceeding
    const validDocuments = documents.filter((doc) => !!doc.id);

    if (validDocuments.length !== documents.length) {
      console.warn(
        `${documents.length - validDocuments.length} documents were skipped due to missing IDs`
      );
    }

    if (validDocuments.length === 0) {
      toast.error("No valid documents to restore");
      return false;
    }

    // Create array of document IDs to restore
    const documentIds = validDocuments.map((doc) => doc.id);

    // Update documents to not archived
    const { error: dbError } = await supabase
      .from("documents")
      .update({ archived: false })
      .in("id", documentIds)
      .eq("user_id", userData.user.id);

    if (dbError) {
      console.error("Database error in bulkRestoreDocuments:", dbError);
      throw dbError;
    }

    // Add a delay to ensure UI updates properly
    await new Promise((resolve) => setTimeout(resolve, 300));

    toast.success(`${validDocuments.length} documents restored successfully`);
    return true;
  } catch (error) {
    console.error("Error bulk restoring documents:", error);
    toast.error(`Failed to restore documents. Please try again.`);
    return false;
  }
};

/**
 * Update category for multiple documents
 */
export const bulkUpdateCategory = async (
  documents: Document[],
  newCategory: string
): Promise<boolean> => {
  if (documents.length === 0 || !newCategory) return false;

  try {
    // Get current user
    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("Authentication error in bulkUpdateCategory:", authError);
      toast.error("Authentication error. Please try again.");
      return false;
    }

    if (!userData?.user) {
      toast.error("You must be logged in to update documents");
      return false;
    }

    // Validate documents before proceeding
    const validDocuments = documents.filter((doc) => !!doc.id);

    if (validDocuments.length === 0) {
      toast.error("No valid documents to update");
      return false;
    }

    // Create array of document IDs to update
    const documentIds = validDocuments.map((doc) => doc.id);

    // Update category in database
    const { error } = await supabase
      .from("documents")
      .update({ category: newCategory })
      .in("id", documentIds)
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Database error in bulkUpdateCategory:", error);
      throw error;
    }

    toast.success(`Updated category for ${validDocuments.length} documents`);
    return true;
  } catch (error) {
    console.error("Error updating document categories:", error);
    toast.error("Failed to update document categories");
    return false;
  }
};
