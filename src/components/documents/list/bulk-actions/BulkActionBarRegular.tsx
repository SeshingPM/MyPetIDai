import React from "react";
import { Download, Mail, Star, Archive } from "lucide-react";
import { Document } from "@/utils/types";
import BulkActionButton from "./BulkActionButton";

interface BulkActionBarRegularProps {
  selectedDocuments: Document[];
  handleBulkArchive: () => void;
  handleBulkDownload: () => void;
  handleBulkEmail: () => void;
  handleBulkFavorite: () => void;
}

const BulkActionBarRegular: React.FC<BulkActionBarRegularProps> = ({
  selectedDocuments,
  handleBulkArchive,
  handleBulkDownload,
  handleBulkEmail,
  handleBulkFavorite,
}) => {
  // Regular document view (not archive) bulk actions
  return (
    <div className="flex space-x-2">
      <BulkActionButton icon={Mail} label="Email" onClick={handleBulkEmail} />

      <BulkActionButton
        icon={Star}
        label="Bookmark"
        onClick={handleBulkFavorite}
      />

      <BulkActionButton
        icon={Download}
        label="Download"
        onClick={handleBulkDownload}
      />

      <BulkActionButton
        icon={Archive}
        label="Archive"
        onClick={handleBulkArchive}
        variant="destructive"
      />
    </div>
  );
};

export default BulkActionBarRegular;
