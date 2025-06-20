
import React from 'react';

interface DocumentTitleProps {
  name: string;
}

const DocumentTitle: React.FC<DocumentTitleProps> = ({ name }) => {
  return (
    <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
      {name}
    </h3>
  );
};

export default DocumentTitle;
