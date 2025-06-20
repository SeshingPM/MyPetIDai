import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Document } from "@/utils/types";
import { ActionMenu } from "./action-menu/ActionMenu";
import { DeleteConfirmationDialog } from "./action-menu/DeleteConfirmationDialog";
import { BookmarkButton } from "./action-menu/BookmarkButton";
import { toast } from "sonner";
import { toggleDocumentBookmark } from "@/utils/document-api/update";
import { useQueryClient } from "@tanstack/react-query";

export interface DocumentActionsProps {
  document: Document;
  onDelete?: () => void;
  onRestore?: () => void;
  onPermanentDelete?: () => void;
  onEmailDocument?: () => void;
  onToggleBookmark?: (document: Document) => void;
  onShareDocument?: () => void;
  onEditDocument?: (document: Document) => void;
  isArchiveView?: boolean;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
  onDelete,
  onRestore,
  onPermanentDelete,
  onEmailDocument,
  onToggleBookmark,
  onShareDocument,
  onEditDocument,
  isArchiveView = false,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localIsBookmarked, setLocalIsBookmarked] = useState(
    !!document.isFavorite
  );
  const isMounted = useRef(true);
  const queryClient = useQueryClient();

  // Set up cleanup to prevent state updates after unmount
  useEffect(() => {
    isMounted.current = true;
    // Keep local state in sync with prop
    setLocalIsBookmarked(!!document.isFavorite);
    return () => {
      isMounted.current = false;
    };
  }, [document.isFavorite]);

  // Direct handler for toggling bookmarks that doesn't rely on parent component
  const handleDirectToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      // Toggle local state immediately for UI feedback
      const newStatus = !localIsBookmarked;
      setLocalIsBookmarked(newStatus);

      // Call the API to update the database, with showToast=false to avoid duplicate notifications
      await toggleDocumentBookmark(document.id, !newStatus, false);

      // Show success message - AppToaster will filter this if needed
      const actionText = newStatus ? "added to" : "removed from";
      toast.success(`Document ${actionText} bookmarks`);

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({
        queryKey: ["dashboardRealDocuments"],
      });
      await queryClient.invalidateQueries({ queryKey: ["documents"] });

      // Also call the parent handler if provided
      if (onToggleBookmark) {
        onToggleBookmark(document);
      }
    } catch (error) {
      // Revert local state on error
      setLocalIsBookmarked(!localIsBookmarked);
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark status");
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProcessing) return;

    if (isArchiveView) {
      // If in archive view, confirm permanent deletion
      if (isMounted.current) {
        setConfirmOpen(true);
      }
    } else if (onDelete) {
      // Otherwise archive (soft delete)
      onDelete();
    }
  };

  // Properly handle permanent deletion with Promise<boolean>
  const handleConfirmPermanentDelete = async (): Promise<boolean> => {
    if (isProcessing) return false;

    try {
      if (isMounted.current) {
        setIsProcessing(true);
      }

      // If onPermanentDelete is provided, call it
      if (onPermanentDelete) {
        // Add some safety by wrapping in a try/catch
        try {
          onPermanentDelete();

          // Instead of relying on onPermanentDelete to return anything,
          // we just assume success here and handle failures via error boundary
          return true;
        } catch (err) {
          console.error(
            "Error during permanent delete handler execution:",
            err
          );
          toast.error("Error processing delete operation");
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error(
        "Error during permanent delete confirmation handling:",
        error
      );
      return false;
    } finally {
      // Set a small delay to allow UI updates to process
      setTimeout(() => {
        if (isMounted.current) {
          setIsProcessing(false);
        }
      }, 500);
    }
  };

  return (
    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
      {!isArchiveView && (
        <BookmarkButton
          isBookmarked={localIsBookmarked}
          onToggle={handleDirectToggleBookmark}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            type="button"
            onClick={(e) => e.stopPropagation()}
            disabled={isProcessing}
          >
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <ActionMenu
            document={document}
            onEmailDocument={onEmailDocument}
            onShareDocument={onShareDocument}
            onEditDocument={onEditDocument}
            onRestore={onRestore}
            onDelete={handleDeleteClick}
            isArchiveView={isArchiveView}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (isMounted.current && !isProcessing) {
            setConfirmOpen(open);
          }
        }}
        onConfirm={handleConfirmPermanentDelete}
      />
    </div>
  );
};

export default DocumentActions;
