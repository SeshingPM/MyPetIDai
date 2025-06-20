
import React from 'react';
import { Card } from '@/components/ui/card';
import { BlogAuthor } from '@/data/blog/types';

interface AuthorBioProps {
  author: BlogAuthor;
}

const AuthorBio: React.FC<AuthorBioProps> = ({ author }) => {
  return (
    <Card className="p-6 mb-10 bg-gray-50">
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <img 
            src={author.avatar}
            alt={author.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">About {author.name}</h3>
          <p className="text-gray-600 mb-3">{author.role} at MyPetID</p>
          <p className="text-gray-700">
            Expert in pet care with over 7 years of experience helping pet owners maintain healthy, happy companions.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AuthorBio;
