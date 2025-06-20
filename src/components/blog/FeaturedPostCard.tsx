
import React from 'react';
import { BlogPost } from '@/data/blogData';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface FeaturedPostCardProps {
  post: BlogPost;
}

const FeaturedPostCard: React.FC<FeaturedPostCardProps> = ({ post }) => {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <Link to={`/blog/${post.slug}`} className="block flex-shrink-0">
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
            Featured
          </Badge>
          <Link to={`/blog/category/${post.category.toLowerCase()}`}>
            <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
              {post.category}
            </Badge>
          </Link>
        </div>
        
        <Link to={`/blog/${post.slug}`} className="block mb-3 group">
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-6 flex-grow">{post.excerpt}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{post.readTime} min read</span>
            </div>
          </div>
          
          <Link 
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
          >
            Read more <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default FeaturedPostCard;
