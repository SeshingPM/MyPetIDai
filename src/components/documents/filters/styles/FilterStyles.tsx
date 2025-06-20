
import { cn } from "@/lib/utils";

// Base container styles for filter components
export const filterContainerClass = (className?: string) => cn(
  "relative group",
  className
);

// Base styles for select component triggers
export const selectTriggerClass = cn(
  "bg-white/80 border-gray-200",
  "hover:border-primary/30 focus:border-primary/40",
  "focus:ring-2 focus:ring-primary/20",
  "h-11 transition-all duration-200"
);

// Base styles for search input field
export const searchInputClass = cn(
  "pl-10 pr-8 h-11",
  "bg-white/80 border-gray-200",
  "focus:border-primary/40 focus:ring-2 focus:ring-primary/20",
  "rounded-lg transition-all duration-200"
);

// Filter icon container styles
export const filterIconClass = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none";

// Clear button styles
export const clearButtonClass = cn(
  "absolute inset-y-0 right-0 pr-3 flex items-center",
  "text-gray-400 hover:text-gray-600 transition-colors"
);
