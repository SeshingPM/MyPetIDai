
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface BlogTagsListProps {
  tags: string[];
}

const BlogTagsList: React.FC<BlogTagsListProps> = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {tags.map(tag => (
        <Link key={tag} to={`/blog/tag/${tag}`}>
          <Badge variant="outline" className="bg-gray-50 hover:bg-gray-100">
            #{tag}
          </Badge>
        </Link>
      ))}
    </div>
  );
};

export default BlogTagsList;
