
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TableOfContentsProps {
  headings: string[];
  isMobile?: boolean;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings, isMobile = false }) => {
  if (headings.length === 0) return null;

  return (
    <Card className={`p-5 mb-6 ${isMobile ? 'bg-gray-50' : 'bg-gray-50 sticky top-24'}`}>
      <h2 className="text-lg font-bold mb-4">Table of Contents</h2>
      <ul className="space-y-3">
        {headings.map((heading, index) => {
          const id = heading.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
          return (
            <li key={index} className="flex items-start">
              <ChevronRight size={isMobile ? 14 : 16} className="text-primary mt-1 mr-1 flex-shrink-0" />
              <a 
                href={`#${id}`} 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {heading}
              </a>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

export default TableOfContents;
