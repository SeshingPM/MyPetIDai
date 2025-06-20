
import React from 'react';
import { Vaccination } from '@/utils/types';
import { format, isBefore } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CalendarClock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getDaysUntilExpiration } from './utils/dateUtils';

interface VaccinationItemProps {
  vaccination: Vaccination;
  onEdit: (vaccination: Vaccination) => void;
  onDelete: (id: string) => void;
}

const VaccinationItem: React.FC<VaccinationItemProps> = ({ 
  vaccination,
  onEdit,
  onDelete
}) => {
  const isExpired = vaccination.expirationDate && 
    isBefore(new Date(vaccination.expirationDate), new Date());
  
  const daysUntilExpiration = vaccination.expirationDate 
    ? getDaysUntilExpiration(vaccination.expirationDate)
    : null;
  
  const getStatusIcon = () => {
    if (isExpired) {
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    } else if (daysUntilExpiration !== null && daysUntilExpiration <= 90) {
      return <CalendarClock className="h-4 w-4 text-amber-500" />;
    } else {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };
  
  return (
    <div className="border-b border-gray-100 py-3 last:border-0">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="mt-1">{getStatusIcon()}</div>
          <div>
            <h4 className="font-medium text-sm sm:text-base">{vaccination.name}</h4>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
              Administered: {format(new Date(vaccination.dateAdministered), 'MMM d, yyyy')}
              {vaccination.administrator && ` by ${vaccination.administrator}`}
            </div>
            
            {vaccination.expirationDate && (
              <div className={`text-xs sm:text-sm font-medium mt-1 ${
                isExpired ? 'text-orange-600' : 'text-muted-foreground'
              }`}>
                {isExpired 
                  ? `Expired: ${format(new Date(vaccination.expirationDate), 'MMM d, yyyy')}` 
                  : `Valid until: ${format(new Date(vaccination.expirationDate), 'MMM d, yyyy')}`
                }
              </div>
            )}
            
            {vaccination.notes && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {vaccination.notes}
              </p>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(vaccination)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(vaccination.id)}
              className="text-red-600 focus:text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default VaccinationItem;
