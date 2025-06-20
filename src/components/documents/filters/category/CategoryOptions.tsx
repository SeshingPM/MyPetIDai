
import React from 'react';
import { FileText, Star, FolderOpen } from 'lucide-react';

export interface CategoryOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

// Predefined category options with icons
export const getCategoryOptions = (): CategoryOption[] => [
  { value: 'All Categories', label: 'All Categories', icon: <FileText className="h-4 w-4 text-gray-500" /> },
  { value: 'Favorites', label: 'Favorites', icon: <Star className="h-4 w-4 text-yellow-500" /> },
  { value: 'Medical', label: 'Medical', icon: <FolderOpen className="h-4 w-4 text-red-500" /> },
  { value: 'Insurance', label: 'Insurance', icon: <FolderOpen className="h-4 w-4 text-blue-500" /> },
  { value: 'Vaccination', label: 'Vaccination', icon: <FolderOpen className="h-4 w-4 text-green-500" /> },
  { value: 'Registration', label: 'Registration', icon: <FolderOpen className="h-4 w-4 text-purple-500" /> },
  { value: 'Training', label: 'Training', icon: <FolderOpen className="h-4 w-4 text-orange-500" /> },
  { value: 'Photos', label: 'Photos', icon: <FolderOpen className="h-4 w-4 text-pink-500" /> },
];
