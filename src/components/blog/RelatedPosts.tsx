
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BlogPost } from '@/data/blogData';

interface RelatedPostsProps {
  posts: BlogPost[];
  formatDate: (dateString: string) => string;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts, formatDate }) => {
  if (posts.length === 0) return null;

  return (
    <div className="mt-16">
      <Separator className="mb-8" />
      <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <Card key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
            <Link to={`/blog/${post.slug}`} className="block h-full">
              <div className="aspect-[3/2] bg-gray-100">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    {post.category}
                  </Badge>
                </div>
                <h4 className="font-bold text-lg mb-2 hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="text-sm text-gray-500 mt-auto flex items-center gap-2">
                  <Calendar size={14} />
                  {formatDate(post.date)}
                  <span className="mx-1">•</span>
                  <Clock size={14} />
                  {post.readTime} min read
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
