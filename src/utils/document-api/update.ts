import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Update a document's metadata
 */
export const updateDocument = async (
  documentId: string,
  updates: { name?: string; category?: string; petId?: string }
): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error("You must be logged in to update documents");
      return false;
    }

    // Process updates to handle special values
    const processedUpdates = {
      ...updates,
      // Convert 'none' to null for petId
      pet_id: updates.petId === "none" ? null : updates.petId,
    };

    // Remove the original petId property
    if ("petId" in processedUpdates) {
      delete processedUpdates.petId;
    }

    const { error } = await supabase
      .from("documents")
      .update(processedUpdates)
      .eq("id", documentId)
      .eq("user_id", userData.user.id);

    if (error) throw error;

    toast.success("Document updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    toast.error("Failed to update document. Please try again.");
    return false;
  }
};

/**
 * Toggle favorite status for a document
 */
export const toggleDocumentFavorite = async (
  documentId: string,
  currentStatus: boolean,
  showToast: boolean = false
): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      if (showToast) {
        toast.error("You must be logged in to update documents");
      }
      return false;
    }

    const { error } = await supabase
      .from("documents")
      .update({ is_favorite: !currentStatus })
      .eq("id", documentId)
      .eq("user_id", userData.user.id);

    if (error) throw error;

    // Check if we're on the dashboard and skip toast if so
    const isDashboard =
      typeof window !== "undefined" &&
      window.location.pathname.includes("/dashboard");

    // Only show toast if explicitly requested AND not on dashboard
    if (showToast && !isDashboard) {
      toast.success(
        currentStatus ? "Removed from bookmarks" : "Added to bookmarks"
      );
    }
    return true;
  } catch (error) {
    console.error("Error updating favorite status:", error);
    if (showToast) {
      toast.error("Failed to update bookmark status");
    }
    return false;
  }
};

/**
 * Toggle bookmark status for a document (wrapper for toggleDocumentFavorite for consistency)
 */
export const toggleDocumentBookmark = toggleDocumentFavorite;
