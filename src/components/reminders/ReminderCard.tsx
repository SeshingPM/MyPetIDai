import React from "react";
import { format } from "date-fns";
import {
  Bell,
  Check,
  Calendar,
  X,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  Archive,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface ReminderProps {
  id: string;
  title: string;
  date: Date;
  petId?: string; // Kept for backward compatibility
  petName?: string; // Kept for backward compatibility
  pets?: { petId: string; petName: string }[]; // Added for multiple pets
  notes?: string;
  completed?: boolean;
  archived?: boolean;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onEdit?: (id: string) => void;
  dashboardView?: boolean; // Flag to indicate if this is displayed on the dashboard
}

const ReminderCard: React.FC<ReminderProps> = ({
  id,
  title,
  date,
  petName,
  pets,
  notes,
  archived = false,
  onComplete,
  onDelete,
  onReschedule,
  onEdit,
  dashboardView = false,
}) => {
  const isOverdue = !archived && new Date() > date;
  const isToday =
    !archived && new Date().toDateString() === date.toDateString();

  const getStatusIcon = () => {
    if (archived) return <Archive size={16} className="text-gray-600" />;
    if (isOverdue) return <CalendarX size={16} className="text-red-600" />;
    if (isToday) return <CalendarClock size={16} className="text-amber-600" />;
    return <Bell size={16} className="text-blue-600" />;
  };

  const getStatusBgColor = () => {
    if (archived) return "bg-gray-100";
    if (isOverdue) return "bg-red-100";
    if (isToday) return "bg-amber-100";
    return "bg-blue-100";
  };

  const getCardBorderColor = () => {
    if (archived) return "border-gray-200";
    if (isOverdue) return "border-red-200";
    if (isToday) return "border-amber-200";
    return "border-blue-200";
  };

  // Helper to get a formatted string of pet names
  const getPetNamesDisplay = () => {
    if (pets && pets.length > 0) {
      return pets.map((pet) => pet.petName).join(", ");
    }
    return petName || "General";
  };

  // If dashboardView is true, use the mockup layout
  if (dashboardView) {
    return (
      <Card className="rounded-lg overflow-hidden border border-gray-100 transition-all hover:shadow-md">
        <div className="p-4">
          {/* Header with icon and title */}
          <div className="flex items-start gap-3 mb-1">
            <div className={cn("rounded-full p-2", getStatusBgColor())}>
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-indigo-600">
                For {getPetNamesDisplay()}
              </p>
            </div>
          </div>

          {/* Date with bullet separator */}
          <div className="pl-11 text-sm text-gray-600 flex items-center gap-1 mb-2">
            <Calendar size={14} className="text-gray-400" />
            <span>{format(date, "MMM d, yyyy")}</span>
          </div>

          {/* Notes if any */}
          {notes && (
            <div className="pl-11 text-sm text-gray-500 mb-2">{notes}</div>
          )}

          {/* Action buttons in a row */}
          {!archived && (
            <div className="pl-11 flex flex-wrap gap-2 mt-4">
              {onComplete && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                  onClick={() => onComplete(id)}
                >
                  <Check size={16} className="mr-1" />
                  Complete
                </Button>
              )}

              {onReschedule && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                  onClick={() => onReschedule(id)}
                >
                  <Calendar size={16} className="mr-1" />
                  Reschedule
                </Button>
              )}

              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                  onClick={() => {
                    console.log("Edit button clicked for reminder ID:", id);
                    onEdit(id);
                  }}
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Regular view for non-dashboard pages
  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        archived && "opacity-70",
        isOverdue && !archived && "border-red-200",
        isToday && !archived && "border-amber-200",
        !isOverdue && !isToday && !archived && "border-blue-200",
        getCardBorderColor()
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <div className={cn("mt-1 rounded-full p-2", getStatusBgColor())}>
              {getStatusIcon()}
            </div>

            <div>
              <h3
                className={cn(
                  "font-medium text-sm md:text-base",
                  archived && "line-through text-gray-500"
                )}
              >
                {title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-2 text-xs md:text-sm text-gray-500 mt-1">
                {/* Display either multiple pets or a single pet */}
                {(pets && pets.length > 0) || petName ? (
                  <>
                    <span className="font-medium text-primary/80">
                      For {getPetNamesDisplay()}
                    </span>
                    <span>•</span>
                  </>
                ) : null}
                <span
                  className={cn(
                    "flex items-center",
                    isOverdue && "text-red-500 font-medium",
                    isToday && "text-amber-500 font-medium"
                  )}
                >
                  <Calendar size={12} className="mr-1" />
                  {format(date, "MMM d, yyyy")}
                </span>
              </div>

              {notes && (
                <p className="text-xs md:text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-md">
                  {notes}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            {!archived && onComplete && (
              <Button
                size="sm"
                variant="outline"
                className="px-2 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                onClick={() => onComplete(id)}
              >
                <Check size={16} className="mr-1" />
                <span className="hidden sm:inline">Complete</span>
              </Button>
            )}

            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                className="px-2 text-destructive hover:text-destructive hover:bg-red-50"
                onClick={() => onDelete(id)}
              >
                <X size={16} className="mr-1" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            )}

            {!archived && onReschedule && (
              <Button
                size="sm"
                variant="outline"
                className="px-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                onClick={() => onReschedule(id)}
              >
                <Calendar size={16} className="mr-1" />
                <span className="hidden sm:inline">Reschedule</span>
              </Button>
            )}

            {!archived && onEdit && (
              <Button
                size="sm"
                variant="outline"
                className="px-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                onClick={() => {
                  console.log("Edit button clicked for reminder ID:", id);
                  onEdit(id);
                }}
              >
                <Edit size={16} className="mr-1" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderCard;
