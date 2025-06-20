import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "./types";
import { addHours } from "date-fns";

/**
 * Generate a share link for a document
 */
export const generateShareLink = async (
  documentId: string,
  expiryHours: number = 48
): Promise<Document | null> => {
  if (!documentId) {
    console.error("No document ID provided");
    toast.error("Invalid document. Please try again.");
    return null;
  }

  try {
    // Check if user is logged in
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Authentication error:", userError);
      toast.error("Authentication error. Please sign in again.");
      return null;
    }

    if (!userData.user) {
      toast.error("You must be logged in to share documents");
      return null;
    }

    // Generate a random share ID with low collision probability
    const shareId = `share_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
    const shareExpiry = addHours(new Date(), expiryHours);

    // Update the document with the share ID and expiry
    const { data, error } = await supabase
      .from("documents")
      .update({
        share_id: shareId,
        share_expiry: shareExpiry.toISOString(),
      })
      .eq("id", documentId)
      .eq("user_id", userData.user.id)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Database error when generating share link:", error);
      toast.error("Failed to generate share link. Please try again.");
      return null;
    }

    if (!data) {
      toast.error("Document not found or access denied");
      return null;
    }

    // Map from database format to our app format
    return {
      id: data.id,
      name: data.name,
      fileUrl: data.file_url,
      fileType: data.file_type,
      category: data.category,
      createdAt: data.created_at,
      userId: data.user_id,
      shareUrl: `${window.location.origin}/shared/${shareId}`,
      shareExpiry: new Date(data.share_expiry),
    };
  } catch (error) {
    console.error("Error generating share link:", error);
    toast.error("Failed to generate share link. Please try again.");
    return null;
  }
};

/**
 * Remove a share link from a document
 */
export const removeShareLink = async (documentId: string): Promise<boolean> => {
  if (!documentId) {
    console.error("No document ID provided");
    toast.error("Invalid document. Please try again.");
    return false;
  }

  try {
    // Check if user is logged in
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Authentication error:", userError);
      toast.error("Authentication error. Please sign in again.");
      return false;
    }

    if (!userData.user) {
      toast.error("You must be logged in to remove a share link");
      return false;
    }

    // Update the document to remove the share ID and expiry
    const { error } = await supabase
      .from("documents")
      .update({
        share_id: null,
        share_expiry: null,
      })
      .eq("id", documentId)
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Database error when removing share link:", error);
      toast.error("Failed to remove share link. Please try again.");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error removing share link:", error);
    toast.error("Failed to remove share link. Please try again.");
    return false;
  }
};

/**
 * Check if a document's share link is still valid
 */
export const isShareLinkValid = (document: Document | null): boolean => {
  if (!document) {
    return false;
  }

  if (!document.shareUrl || !document.shareExpiry) {
    return false;
  }

  const now = new Date();
  return document.shareExpiry > now;
};

/**
 * Get a document by its share ID
 */
export const getDocumentByShareId = async (
  shareId: string
): Promise<Document | null> => {
  if (!shareId) {
    console.error("[DEBUG] No share ID provided to getDocumentByShareId");
    return null;
  }

  console.log("[DEBUG] getDocumentByShareId called with:", shareId);

  try {
    // Create a client that will work for both authenticated and unauthenticated users
    // The supabase client will automatically use the anonymous/public role when no session exists
    console.log("[DEBUG] Using supabase client for shared document access");

    // Query the document by share ID
    console.log(
      "[DEBUG] Querying database for document with share_id:",
      shareId
    );
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("share_id", shareId)
      .maybeSingle();

    if (error) {
      console.error(
        "[DEBUG] Database error when getting document by share ID:",
        error
      );
      return null;
    }

    console.log("[DEBUG] Query result:", data);

    if (!data) {
      console.log("[DEBUG] No document found with share_id:", shareId);
      return null;
    }

    // Check if the share has expired
    if (data.share_expiry) {
      const expiry = new Date(data.share_expiry);
      const now = new Date();

      console.log("[DEBUG] Share expiry check - Expiry:", expiry, "Now:", now);

      if (expiry < now) {
        // Share has expired
        console.log("[DEBUG] Share has expired");
        return null;
      }
    }

    // Map from database format to our app format
    const document = {
      id: data.id,
      name: data.name,
      fileUrl: data.file_url,
      fileType: data.file_type,
      category: data.category,
      createdAt: data.created_at,
      userId: data.user_id,
      shareUrl: `${window.location.origin}/shared/${shareId}`,
      shareExpiry: data.share_expiry ? new Date(data.share_expiry) : null,
    };

    console.log("[DEBUG] Returning document:", document);
    return document;
  } catch (error) {
    console.error("[DEBUG] Error getting document by share ID:", error);
    return null;
  }
};
