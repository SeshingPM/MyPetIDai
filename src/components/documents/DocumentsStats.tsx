
import React from 'react';
import { Document } from '@/utils/types';
import { FileText, Star, Calendar, FileType, Filter } from 'lucide-react';

interface DocumentsStatsProps {
  documents: Document[];
  filteredCount: number;
  onTypeFilterClick?: (type: string) => void;
  activeTypeFilter?: string;
}

const DocumentsStats: React.FC<DocumentsStatsProps> = ({ 
  documents, 
  filteredCount, 
  onTypeFilterClick,
  activeTypeFilter = ''
}) => {
  if (!documents || documents.length === 0) return null;

  // Calculate document type statistics
  const typeStats = documents.reduce((acc, doc) => {
    const type = doc.fileType?.split('/')[0] || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate favorites count
  const favoritesCount = documents.filter(doc => doc.isFavorite).length;

  // Handle click on type filter
  const handleTypeClick = (type: string) => {
    if (onTypeFilterClick) {
      onTypeFilterClick(activeTypeFilter === type ? '' : type);
    }
  };

  return (
    <div className="mb-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex items-center bg-white/60 px-3 py-1.5 rounded-md">
          <FileText size={16} className="mr-2 text-primary" />
          <span className="font-medium text-sm">{documents.length} Total</span>
        </div>
        
        {filteredCount !== documents.length && (
          <div className="flex items-center bg-white/60 px-3 py-1.5 rounded-md">
            <FileType size={16} className="mr-2 text-gray-600" />
            <span className="font-medium text-sm">{filteredCount} Showing</span>
          </div>
        )}
        
        {favoritesCount > 0 && (
          <div 
            className={`flex items-center ${onTypeFilterClick ? 'cursor-pointer hover:bg-white transition-colors' : ''} ${activeTypeFilter === 'favorite' ? 'bg-yellow-100 border border-yellow-300' : 'bg-white/60'} px-3 py-1.5 rounded-md`}
            onClick={() => onTypeFilterClick && handleTypeClick('favorite')}
            title={activeTypeFilter === 'favorite' ? "Clear favorites filter" : "Filter by favorites"}
          >
            <Star size={16} className="mr-2 text-yellow-500" />
            <span className="font-medium text-sm">{favoritesCount} Favorites</span>
            {activeTypeFilter === 'favorite' && (
              <span className="ml-1 text-xs bg-yellow-200 text-yellow-800 px-1 rounded">active</span>
            )}
          </div>
        )}
        
        <div className="hidden md:flex flex-wrap gap-2">
          {Object.entries(typeStats).map(([type, count]) => (
            <div 
              key={type} 
              className={`${onTypeFilterClick ? 'cursor-pointer hover:bg-white/90 transition-colors' : ''} ${activeTypeFilter === type ? 'bg-primary/20 border border-primary/30' : 'bg-white/60'} px-3 py-1.5 rounded-md flex items-center`}
              onClick={() => onTypeFilterClick && handleTypeClick(type)}
              title={activeTypeFilter === type ? `Clear ${type} filter` : `Filter by ${type} file type`}
            >
              <span className="text-xs font-medium capitalize">
                {type}: {count}
              </span>
              {activeTypeFilter === type && (
                <Filter size={12} className="ml-1 text-primary" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsStats;
