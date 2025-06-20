
import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/data/blogData';

interface BlogPostHeaderProps {
  post: BlogPost;
  formatDate: (dateString: string) => string;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ post, formatDate }) => {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Link to={`/blog/category/${post.category.toLowerCase()}`}>
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {post.category}
          </Badge>
        </Link>
      </div>
      
      <h1 itemProp="name" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
        {post.title}
      </h1>
      
      <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div itemProp="author" className="font-medium text-gray-900">{post.author.name}</div>
            <div className="text-sm text-gray-500">{post.author.role}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <time itemProp="datePublished" dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{post.readTime} min read</span>
        </div>
      </div>
    </header>
  );
};

export default BlogPostHeader;
