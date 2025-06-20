import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExternalLink,
  Plus,
  Edit,
  Download,
  Mail,
  Share2,
  Trash,
  Eye,
  Star,
} from "lucide-react";
import GlassCard from "@/components/ui-custom/GlassCard";
import { Button } from "@/components/ui/button";
import { Document } from "@/utils/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/formatting";
import DocumentIcon from "@/components/documents/card/DocumentIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditDocumentForm, {
  DocumentFormValues,
} from "@/components/documents/edit/EditDocumentForm";
import {
  updateDocument,
  toggleDocumentBookmark,
} from "@/utils/document-api/update";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface DashboardRecentDocumentsSectionProps {
  documents: Document[];
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
}

// Single document card component with direct edit handling
const DocumentCard: React.FC<{
  document: Document;
  onEdit: (document: Document) => void;
  onToggleBookmark: (document: Document) => void;
}> = ({ document, onEdit, onToggleBookmark }) => {
  console.log("Rendering DocumentCard for:", document.id);

  return (
    <GlassCard className="hover:shadow-md transition-shadow">
      <div className="p-4 flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <DocumentIcon
            fileType={document.fileType}
            category={document.category}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-800 truncate">
              {document.name}
            </h3>
            {document.isFavorite && (
              <Star
                className="h-4 w-4 text-yellow-400 ml-1 flex-shrink-0"
                fill="currentColor"
                aria-label="Bookmarked"
              />
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{document.category}</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(document.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {/* View Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={() => window.open(`/documents/${document.id}`, "_blank")}
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  window.open(`/documents/${document.id}`, "_blank")
                }
              >
                <Download className="h-4 w-4 mr-2" />
                <span>Download</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Mail className="h-4 w-4 mr-2" />
                <span>Email</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                <span>Share</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleBookmark(document);
                }}
              >
                <Star
                  className={`h-4 w-4 mr-2 ${document.isFavorite ? "text-yellow-400 fill-yellow-400" : ""}`}
                />
                <span>
                  {document.isFavorite ? "Remove bookmark" : "Bookmark"}
                </span>
              </DropdownMenuItem>

              {/* Direct Edit Button with onClick handler */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log(
                    "Direct edit button clicked for document:",
                    document.id
                  );
                  onEdit(document);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                <span>Edit</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600 focus:text-red-500"
                onClick={() => console.log("Archive functionality coming soon")}
              >
                <Trash className="h-4 w-4 mr-2" />
                <span>Archive</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </GlassCard>
  );
};

// Inline edit dialog component
const EditDialog: React.FC<{
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}> = ({ document, open, onOpenChange, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!document) return null;

  const handleSubmit = async (
    formData: DocumentFormValues & { id: string }
  ) => {
    console.log("Submitting document edit:", formData);
    setIsSubmitting(true);

    try {
      const { id, ...updates } = formData;

      // Handle 'none' value for petId
      const processedUpdates = {
        ...updates,
        petId: updates.petId === "none" ? null : updates.petId,
      };

      const success = await updateDocument(id, processedUpdates);

      if (success) {
        // Success toast is now handled by EditDocumentMenuItem
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error("Failed to update document");
      }
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("An error occurred while updating the document");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
        </DialogHeader>
        <EditDocumentForm
          document={document}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

// More icon component
const MoreVertical: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

// Main component
const DashboardRecentDocumentsSection: React.FC<
  DashboardRecentDocumentsSectionProps
> = ({ documents, isLoading, error, onRefresh }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Local state for edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  // Handler for opening the edit dialog
  const handleEditDocument = useCallback((document: Document) => {
    console.log(
      "Dashboard edit document handler called with document:",
      document.id
    );
    setSelectedDocument(document);
    setIsEditDialogOpen(true);
  }, []);

  // Handler for toggling bookmark status
  const handleToggleBookmark = useCallback(
    async (document: Document) => {
      try {
        // Call API with showToast=false to avoid any notifications
        await toggleDocumentBookmark(document.id, !!document.isFavorite, false);

        // Remove toast notifications (no success message shown)

        // Refresh data
        queryClient.invalidateQueries({ queryKey: ["dashboardRealDocuments"] });
        queryClient.invalidateQueries({ queryKey: ["documents"] });
        onRefresh();
      } catch (error) {
        console.error("Error toggling bookmark status:", error);
        // No error toast notification
      }
    },
    [queryClient, onRefresh]
  );

  // Render loading state
  if (isLoading) {
    return (
      <div>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Documents
            </h2>
            <p className="text-sm text-gray-500">
              Quickly access your latest uploads
            </p>
          </div>
          <button className="flex items-center gap-1 text-primary text-sm hover:underline">
            View All <ExternalLink size={14} />
          </button>
        </div>
        <div className="space-y-2.5 sm:space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-24" />
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Documents
            </h2>
            <p className="text-sm text-gray-500">
              Quickly access your latest uploads
            </p>
          </div>
          <button
            onClick={() => navigate("/documents")}
            className="flex items-center gap-1 text-primary text-sm hover:underline"
          >
            View All <ExternalLink size={14} />
          </button>
        </div>
        <GlassCard className="p-4 text-center">
          <p className="text-red-500 mb-2">Failed to load documents</p>
          <button
            onClick={() => navigate("/documents")}
            className="text-primary text-sm hover:underline"
          >
            View all documents
          </button>
        </GlassCard>
      </div>
    );
  }

  // Render empty state
  if (documents.length === 0) {
    return (
      <div>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Documents
            </h2>
            <p className="text-sm text-gray-500">
              Quickly access your latest uploads
            </p>
          </div>
          <button
            onClick={() => navigate("/documents")}
            className="flex items-center gap-1 text-primary text-sm hover:underline"
          >
            View All <ExternalLink size={14} />
          </button>
        </div>
        <GlassCard className="p-4 text-center">
          <p className="mb-2">No documents yet</p>
          <button
            onClick={() => navigate("/documents")}
            className="text-primary text-sm hover:underline"
          >
            Add your first document
          </button>
        </GlassCard>
      </div>
    );
  }

  // Render documents
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Documents
          </h2>
          <p className="text-sm text-gray-500">
            Quickly access your latest uploads
          </p>
        </div>
        <button
          onClick={() => navigate("/documents")}
          className="flex items-center gap-1 text-primary text-sm hover:underline"
        >
          View All <ExternalLink size={14} />
        </button>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onEdit={handleEditDocument}
            onToggleBookmark={handleToggleBookmark}
          />
        ))}

        <GlassCard
          className="flex items-center justify-center py-5 sm:py-6 cursor-pointer"
          onClick={() => navigate("/documents")}
        >
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Plus size={20} className="text-primary" />
            </div>
            <h3 className="font-medium text-gray-700 text-sm">
              Add New Document
            </h3>
          </div>
        </GlassCard>
      </div>

      {/* Edit Dialog */}
      <EditDialog
        document={selectedDocument}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={onRefresh}
      />
    </div>
  );
};

export default DashboardRecentDocumentsSection;
