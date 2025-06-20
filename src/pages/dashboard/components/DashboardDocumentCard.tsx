import React, { useState } from "react";
import { Document } from "@/utils/types";
import GlassCard from "@/components/ui-custom/GlassCard";
import {
  MoreVertical,
  Edit,
  Download,
  Mail,
  Share2,
  Trash,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DocumentIcon from "@/components/documents/card/DocumentIcon";
import { formatDate } from "@/utils/formatting";
import { getDocumentUrl } from "@/utils/document-api/access";
import { downloadDocument } from "@/utils/document-api/download";

interface DashboardDocumentCardProps {
  document: Document;
  onToggleFavorite: (document: Document) => void;
  onEdit: (document: Document) => void;
  onArchive?: (document: Document) => void;
}

const DashboardDocumentCard: React.FC<DashboardDocumentCardProps> = ({
  document,
  onToggleFavorite,
  onEdit,
  onArchive,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Handle direct edit button click
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Direct edit button clicked for document:", document.id);
    onEdit(document);
  };

  // Handle document download
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDownloading) return;

    try {
      setIsDownloading(true);
      await downloadDocument(document.id, document.fileUrl, document.name);
    } catch (error) {
      console.error("Error downloading document:", error);
    } finally {
      setIsDownloading(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <GlassCard className="hover:shadow-md transition-shadow relative">
      <div className="p-4 flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <DocumentIcon
            fileType={document.fileType}
            category={document.category}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-800 truncate">
            {document.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{document.category}</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(document.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {/* View Document Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => window.open(getDocumentUrl(document.id), "_blank")}
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Actions Dropdown */}
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-2" />
                <span>{isDownloading ? "Downloading..." : "Download"}</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Mail className="h-4 w-4 mr-2" />
                <span>Email</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                <span>Share</span>
              </DropdownMenuItem>

              {/* Edit Item - Directly calls the edit handler */}
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                <span>Edit</span>
              </DropdownMenuItem>

              {onArchive && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onArchive) onArchive(document);
                  }}
                  className="text-red-600 focus:text-red-500"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  <span>Archive</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </GlassCard>
  );
};

export default DashboardDocumentCard;
