
import { Document } from './types';

export type SortOption = 'nameAsc' | 'nameDesc' | 'newest' | 'oldest';

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'nameAsc', label: 'Name (A-Z)' },
  { value: 'nameDesc', label: 'Name (Z-A)' }
];

export const sortDocuments = (documents: Document[], sortOption: SortOption): Document[] => {
  const sortedDocs = [...documents];
  
  switch (sortOption) {
    case 'nameAsc':
      return sortedDocs.sort((a, b) => a.name.localeCompare(b.name));
    case 'nameDesc':
      return sortedDocs.sort((a, b) => b.name.localeCompare(a.name));
    case 'newest':
      return sortedDocs.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'oldest':
      return sortedDocs.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    default:
      return sortedDocs;
  }
};
