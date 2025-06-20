
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mail, FolderPlus, Trash, X, CheckCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Document } from '@/utils/types';

type BulkAction = 'download' | 'email' | 'categorize' | 'delete' | 'deselect';

interface BulkActionsMenuProps {
  selectedDocuments: Document[];
  onAction: (action: BulkAction, data?: any) => void;
  onClearSelection: () => void;
}

const BulkActionsMenu: React.FC<BulkActionsMenuProps> = ({
  selectedDocuments,
  onAction,
  onClearSelection
}) => {
  const count = selectedDocuments.length;
  
  if (count === 0) return null;
  
  const handleDownload = () => {
    onAction('download');
  };
  
  const handleEmail = () => {
    if (count > 5) {
      toast.error("You can only email up to 5 documents at once");
      return;
    }
    onAction('email');
  };
  
  const handleCategorize = () => {
    onAction('categorize');
  };
  
  const handleDelete = () => {
    onAction('delete');
  };
  
  const handleClearSelection = () => {
    onAction('deselect');
    onClearSelection();
  };
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background shadow-lg rounded-lg border z-50 p-2">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 px-3 py-1 rounded-md text-sm font-medium">
          {count} selected
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs"
          onClick={handleClearSelection}
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download ({count})
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleEmail}
              disabled={count > 5}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email {count > 5 ? "(max 5)" : `(${count})`}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCategorize}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Categorize ({count})
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete ({count})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAction('deselect')}
        >
          <CheckCheck className="h-4 w-4 mr-1" />
          Select All
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsMenu;
