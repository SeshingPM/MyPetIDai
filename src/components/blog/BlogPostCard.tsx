
import React from 'react';
import { BlogPost } from '@/data/blogData';
import { Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-6">
        <div className="mb-3">
          <Link to={`/blog/category/${post.category.toLowerCase()}`}>
            <Badge variant="secondary" className="text-xs font-medium">
              {post.category}
            </Badge>
          </Link>
        </div>
        
        <Link to={`/blog/${post.slug}`} className="block mb-2">
          <h3 className="text-xl font-bold text-gray-900 hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostCard;
