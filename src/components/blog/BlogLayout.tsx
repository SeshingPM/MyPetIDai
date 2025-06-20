
import React, { useState } from 'react';
import { BlogPost } from '@/data/blogData';
import FeaturedPostCard from './FeaturedPostCard';
import BlogPostGrid from './BlogPostGrid';
import BlogSidebar from './BlogSidebar';
import BlogHeader from './BlogHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface BlogLayoutProps {
  posts: BlogPost[];
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ posts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get featured posts
  const featuredPosts = posts.filter(post => post.featured);
  
  // Extract all categories
  const categories = Array.from(new Set(posts.map(post => post.category)));
  
  // Extract all tags
  const tags = Array.from(new Set(posts.flatMap(post => post.tags)));
  
  // Filter posts based on search, category, and tag
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || post.category === selectedCategory;
    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTag(null);
  };
  
  return (
    <div className="container-max py-10">
      <div className="mb-12">
        <BlogHeader 
          title="PetDocument Blog" 
          description="Expert advice, tips, and insights for pet owners on health, care, and document management."
        />
        
        <div className="mt-8 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search for articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 rounded-full border-gray-200 bg-white/90 shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            />
          </div>
        </div>
      </div>

      {featuredPosts.length > 0 && searchQuery === '' && !selectedCategory && !selectedTag && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map(post => (
              <FeaturedPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          {filteredPosts.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCategory ? selectedCategory : selectedTag ? `#${selectedTag}` : 'All Articles'}
                </h2>
                {(selectedCategory || selectedTag || searchQuery) && (
                  <Button variant="ghost" onClick={clearFilters} className="text-sm">
                    Clear filters
                  </Button>
                )}
              </div>
              <BlogPostGrid posts={filteredPosts} />
            </>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={clearFilters}>View all articles</Button>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-4">
          <BlogSidebar 
            categories={categories}
            tags={tags}
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            onSelectCategory={setSelectedCategory}
            onSelectTag={setSelectedTag}
            recentPosts={posts.slice(0, 3)}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogLayout;
