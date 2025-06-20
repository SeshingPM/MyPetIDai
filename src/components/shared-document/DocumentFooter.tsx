
import React from 'react';

const DocumentFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t py-6">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Pet Care App. All rights reserved.
      </div>
    </footer>
  );
};

export default DocumentFooter;
