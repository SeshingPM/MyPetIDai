import React from 'react';
import { 
  DropdownMenuItem, 
} from '@/components/ui/dropdown-menu';
import { Mail, Share2, Edit, Trash, RefreshCw } from 'lucide-react';
import { Document } from '@/utils/types';
import { DownloadMenuItem } from './menu-items/DownloadMenuItem';
import EditDocumentMenuItem from './EditDocumentMenuItem';

interface ActionMenuProps {
  document: Document;
  onEmailDocument?: () => void;
  onShareDocument?: () => void;
  onEditDocument?: (document: Document) => void;
  onRestore?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  isArchiveView?: boolean;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  document,
  onEmailDocument,
  onShareDocument,
  onEditDocument,
  onRestore,
  onDelete,
  isArchiveView = false
}) => {
  return (
    <>
      {/* Download Document */}
      <DownloadMenuItem document={document} />
      
      {/* Email Document */}
      {onEmailDocument && (
        <DropdownMenuItem onClick={onEmailDocument}>
          <Mail className="h-4 w-4 mr-2" />
          <span>Email</span>
        </DropdownMenuItem>
      )}
      
      {/* Share Document */}
      {onShareDocument && (
        <DropdownMenuItem onClick={onShareDocument}>
          <Share2 className="h-4 w-4 mr-2" />
          <span>Share</span>
        </DropdownMenuItem>
      )}
      
      {/* Edit Document Button */}
      {!isArchiveView && (
        <>
          {/* Use the self-contained edit button ONLY in dashboard contexts */}
          {window?.location?.pathname?.includes('/dashboard') ? (
            <EditDocumentMenuItem 
              document={document}
              showSuccessToast={true} // Dashboard should show success toast here
              onSuccess={() => {
                console.log('[ActionMenu] Dashboard document edit successful');
                // Call the original handler just in case, but for dashboard this might be undefined
                if (onEditDocument) onEditDocument(document);
              }}
            />
          ) : (
            /* Use the original edit flow for the regular documents page */
            <DropdownMenuItem 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[ActionMenu] Original edit flow triggered for document:', document.id);
                
                if (onEditDocument) {
                  onEditDocument(document);
                } else {
                  console.log('[ActionMenu] No edit handler provided');
                  import('sonner').then(({ toast }) => {
                    toast.info("Edit functionality coming soon!");
                  });
                }
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              <span>Edit</span>
            </DropdownMenuItem>
          )}
        </>
      )}
      
      {/* Restore Document (Archive View) */}
      {isArchiveView && onRestore && (
        <DropdownMenuItem onClick={onRestore}>
          <RefreshCw className="h-4 w-4 mr-2" />
          <span>Restore</span>
        </DropdownMenuItem>
      )}
      
      {/* Delete/Archive Document */}
      {onDelete && (
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-red-600 focus:text-red-500"
        >
          <Trash className="h-4 w-4 mr-2" />
          <span>{isArchiveView ? 'Delete' : 'Archive'}</span>
        </DropdownMenuItem>
      )}
    </>
  );
};
