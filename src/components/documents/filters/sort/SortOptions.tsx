
import React from 'react';
import { ArrowDownAZ, ArrowUpZA, Clock, CalendarClock } from 'lucide-react';
import { SortOption } from '@/utils/document-sorting';

export interface SortOptionItem {
  value: SortOption;
  label: string;
  icon: React.ReactNode;
}

// Predefined sort options with icons
export const getSortOptions = (): SortOptionItem[] => [
  { value: 'newest', label: 'Newest First', icon: <Clock className="h-4 w-4 text-primary" /> },
  { value: 'oldest', label: 'Oldest First', icon: <CalendarClock className="h-4 w-4 text-gray-500" /> },
  { value: 'nameAsc', label: 'Name (A-Z)', icon: <ArrowDownAZ className="h-4 w-4 text-green-500" /> },
  { value: 'nameDesc', label: 'Name (Z-A)', icon: <ArrowUpZA className="h-4 w-4 text-pink-500" /> },
];
