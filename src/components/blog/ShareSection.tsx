
import React from 'react';
import { Facebook, Twitter, Linkedin, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ShareSection: React.FC = () => {
  return (
    <div className="border-t border-gray-200 pt-8 mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500 mb-2">Share this article</div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
              <Facebook size={18} />
              <span className="sr-only">Share on Facebook</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
              <Twitter size={18} />
              <span className="sr-only">Share on Twitter</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
              <Linkedin size={18} />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full w-10 h-10">
              <Bookmark size={18} />
              <span className="sr-only">Bookmark</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSection;
