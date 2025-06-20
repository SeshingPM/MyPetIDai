import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDocumentRefresh } from "@/utils/document-api/refresh";
import { toast } from "sonner";
import logger from "@/utils/logger";

export const useDocumentUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { refreshDocuments } = useDocumentRefresh();

  const uploadDocument = async ({
    file,
    documentName,
    category,
    petId,
  }: {
    file: File;
    documentName: string;
    category: string;
    petId?: string;
  }) => {
    const requestId = Math.random().toString(36).substring(2, 8);
    logger.info(
      `[DocUpload ${requestId}] Starting upload: ${documentName} (${category})`
    );

    setIsUploading(true);

    try {
      // Get current user
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData.user) throw new Error("Not authenticated");

      const userId = userData.user.id;
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("documents")
        .getPublicUrl(fileName);

      if (!publicUrlData.publicUrl) throw new Error("Failed to get public URL");

      // Create optimistic document data for UI update
      const optimisticDoc = {
        id: `temp-${requestId}`,
        name: documentName,
        category,
        file_url: publicUrlData.publicUrl,
        file_type: file.type,
        user_id: userData.user.id,
        pet_id: petId || null,
        is_favorite: false,
        archived: false,
        created_at: new Date().toISOString(),
      };

      // Apply optimistic update before saving to database
      await refreshDocuments({
        petId,
        optimisticData: optimisticDoc,
      });

      // Save to database
      const { error: dbError, data: savedDoc } = await supabase
        .from("documents")
        .insert({
          name: documentName,
          category,
          file_url: publicUrlData.publicUrl,
          file_type: file.type,
          user_id: userData.user.id,
          pet_id: petId || null,
          is_favorite: false,
          archived: false,
        })
        .select("id")
        .single();

      if (dbError) throw dbError;

      logger.info(
        `[DocUpload ${requestId}] Document saved with ID: ${savedDoc.id}`
      );

      // Force a thorough refresh after successful upload
      await refreshDocuments({ petId });

      toast.success("Document uploaded successfully");
      return savedDoc;
    } catch (error) {
      logger.error(`[DocUpload ${requestId}] Error:`, error);
      toast.error("Upload failed. Please try again.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadDocument,
    isUploading,
  };
};
