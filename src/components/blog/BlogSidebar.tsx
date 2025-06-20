
import React from 'react';
import { BlogPost } from '@/data/blogData';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';

interface BlogSidebarProps {
  categories: string[];
  tags: string[];
  selectedCategory: string | null;
  selectedTag: string | null;
  onSelectCategory: (category: string | null) => void;
  onSelectTag: (tag: string | null) => void;
  recentPosts: BlogPost[];
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onSelectCategory,
  onSelectTag,
  recentPosts
}) => {
  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      onSelectCategory(null);
    } else {
      onSelectCategory(category);
    }
  };

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      onSelectTag(null);
    } else {
      onSelectTag(tag);
    }
  };

  return (
    <aside className="space-y-8">
      {/* Recent Posts */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-100">Recent Posts</h3>
        <div className="space-y-4">
          {recentPosts.map(post => (
            <div key={post.id} className="flex gap-3">
              <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <Link 
                  to={`/blog/${post.slug}`}
                  className="font-medium text-gray-900 hover:text-primary line-clamp-2 mb-1 block"
                >
                  {post.title}
                </Link>
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarDays size={12} className="mr-1" />
                  {post.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-100">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 pb-2 border-b border-gray-100">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "secondary" : "outline"}
              size="sm"
              onClick={() => handleTagClick(tag)}
              className={`rounded-full ${
                selectedTag === tag ? 'bg-gray-200 text-gray-800' : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              #{tag}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Newsletter section removed */}
    </aside>
  );
};

export default BlogSidebar;
