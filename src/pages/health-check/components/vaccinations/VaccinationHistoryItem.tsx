
import React, { useState } from 'react';
import { Vaccination } from '@/utils/types';
import { format } from 'date-fns';
import { Syringe, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import EditVaccinationDialog from './EditVaccinationDialog';

interface VaccinationHistoryItemProps {
  vaccination: Vaccination;
  petName: string;
  onDelete: (id: string) => void;
}

const VaccinationHistoryItem: React.FC<VaccinationHistoryItemProps> = ({ 
  vaccination, 
  petName,
  onDelete 
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  // Prevent event propagation and default behavior
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(vaccination.id);
  };

  return (
    <>
      <div className="p-3 border rounded-md flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <Syringe className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">{vaccination.name}</h4>
            <p className="text-sm text-muted-foreground">
              {vaccination.dateAdministered ? format(new Date(vaccination.dateAdministered), 'MMM d, yyyy') : 'No date'}
            </p>
          </div>
        </div>
        
        <div className="ml-auto flex flex-col sm:flex-row sm:items-center gap-2">
          {vaccination.administrator && (
            <p className="text-sm">
              <span className="text-muted-foreground">Provider:</span> {vaccination.administrator}
            </p>
          )}
          
          {vaccination.expirationDate && (
            <Badge variant={isExpired(vaccination.expirationDate) ? "destructive" : "outline"}>
              {isExpired(vaccination.expirationDate)
                ? `Expired: ${format(new Date(vaccination.expirationDate), 'MMM d, yyyy')}`
                : `Valid until: ${format(new Date(vaccination.expirationDate), 'MMM d, yyyy')}`
              }
            </Badge>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditClick}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Each item manages its own edit dialog */}
      <EditVaccinationDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        vaccination={vaccination}
        petName={petName}
      />
    </>
  );
};

export default VaccinationHistoryItem;
